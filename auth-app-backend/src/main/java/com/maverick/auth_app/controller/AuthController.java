package com.maverick.auth_app.controller;

import com.maverick.auth_app.dtos.LoginRequest;
import com.maverick.auth_app.dtos.RefreshTokenRequest;
import com.maverick.auth_app.dtos.TokenResponse;
import com.maverick.auth_app.dtos.UserDtos;
import com.maverick.auth_app.entities.RefreshToken;
import com.maverick.auth_app.entities.User;
import com.maverick.auth_app.repositories.RefreshTokenRepository;
import com.maverick.auth_app.repositories.UserRepository;
import com.maverick.auth_app.security.CookiesService;
import com.maverick.auth_app.security.JwtAuthentictionFilter;
import com.maverick.auth_app.security.JwtService;
import com.maverick.auth_app.services.AuthService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.AccessFlag;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepo;

    private final JwtService jwtService;

    private final ModelMapper modelMapper;

    private final PasswordEncoder passwordEncoder;

    private final RefreshTokenRepository refreshTokenRepository;

    private final CookiesService cookiesService;

    private static final Logger log = LoggerFactory.getLogger(JwtAuthentictionFilter.class);

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authenticate = authenticate(loginRequest);
        User user = userRepo.findByEmail(loginRequest.email()).orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        if (!user.isEnabled()) {
            throw new DisabledException("User is disabled");
        }

        String jti = UUID.randomUUID().toString();
        var refreshTokenOb = RefreshToken.builder().
                jti(jti).
                user(user).
                createdAt(Instant.now()).
                expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds())).
                revoked(false).
                build();

        refreshTokenRepository.save(refreshTokenOb);

        //generate access token
        String accessToken = jwtService.generateAccessToken(user);
        //generate Refresh token
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenOb.getJti());

        //use cookie service to attach refresh token in cookie
        cookiesService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookiesService.addNoStoreHeaders(response);

        TokenResponse tokenResponse = TokenResponse.of(accessToken, refreshToken, jwtService.getAccessTtlSeconds(), modelMapper.map(user, UserDtos.class));

        return ResponseEntity.ok(tokenResponse);
    }

    private Authentication authenticate(LoginRequest loginRequest) {
        try {
            return
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid Username or password");
        }
    }

    @PostMapping("/refresh")
    private ResponseEntity<TokenResponse> refreshToken(@RequestBody(required = false) RefreshTokenRequest body, HttpServletResponse response, HttpServletRequest request) {
        String refreshToken = readRefreshTokenFromRequest(body, request).orElseThrow(() -> new BadCredentialsException("Refresh token is missing"));

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("invalid refresh token type");
        }

        String jti = jwtService.getJti(refreshToken);
        UUID userId = jwtService.getUserId(refreshToken);
        RefreshToken storedRefreshToken = refreshTokenRepository.findByJti(jti).orElseThrow(() -> new BadCredentialsException("invalid refresh token"));

        if (storedRefreshToken.isRevoked()) {
            throw new BadCredentialsException("Refresh token is revoked");
        }

        if (storedRefreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh Token expired");
        }
        if (!storedRefreshToken.getUser().getId().equals(userId)) {
            throw new BadCredentialsException("refresh token does not belong to this user");
        }
//        refresh token to rotate
        storedRefreshToken.setRevoked(true);
        String newJti = UUID.randomUUID().toString();
        storedRefreshToken.setReplacedByToken(newJti);
        refreshTokenRepository.save(storedRefreshToken);

        User user = storedRefreshToken.getUser();

        var newRefreshTokenOb = RefreshToken.builder().
                jti(newJti).
                user(user).
                createdAt(Instant.now()).
                expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds())).
                revoked(false).
                build();

        refreshTokenRepository.save(newRefreshTokenOb);
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user, newRefreshTokenOb.getJti());
        cookiesService.attachRefreshCookie(response, newRefreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookiesService.addNoStoreHeaders(response);

        return ResponseEntity.ok(TokenResponse.of(newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(), modelMapper.map(user, UserDtos.class)));
    }


    private Optional<String> readRefreshTokenFromRequest(RefreshTokenRequest body, HttpServletRequest request) {
//        1. prefer reading refresh token from cookie
        if (request.getCookies() != null) {
            Optional<String> cookie = Arrays.stream(request.getCookies()).
                    filter(c -> cookiesService.getRefreshTokenCookieName().equals(c.getName())).
                    map(Cookie::getValue).
                    filter(v -> !v.isBlank()).
                    findFirst();

            if (cookie.isPresent())
                return cookie;

        }
//        2. Return the refresh token from body
        if (body != null && body.refreshToken() != null && !body.refreshToken().isBlank()) {
            return Optional.of(body.refreshToken());
        }

//        3. Custom header
        String refreshHeader = request.getHeader("X-Refresh-Token");
        if (refreshHeader != null && !refreshHeader.isBlank()) {
            return Optional.of(refreshHeader.trim());
        }

//        4. Authorization = Bearer <token>
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
            String candidate = authHeader.substring(7).trim();
            if (!candidate.isEmpty()) {
                try {
                    if (jwtService.isRefreshToken(candidate)) {
                        return Optional.of(candidate);
                    }
                } catch (Exception e) {
                    log.debug("Invalid refresh token", e);
                }
            }
        }
        return Optional.empty();
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest
                                               request, HttpServletResponse response) {
        readRefreshTokenFromRequest(null, request).ifPresent(token -> {
            try {
                if (jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJti(token);
                    refreshTokenRepository.findByJti(jti).ifPresent(rt->{
                        rt.setRevoked(true);
                        refreshTokenRepository.save(rt);
                    });
                }
            }
            catch (JwtException ignored){

            }

        });
        cookiesService.clearRefreshCookie(response);
        cookiesService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/register")
    public ResponseEntity<UserDtos> registerUser(@RequestBody UserDtos userDtos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(userDtos));
    }
}
