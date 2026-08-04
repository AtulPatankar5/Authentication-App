package com.maverick.auth_app.security;


import com.maverick.auth_app.entities.Provider;
import com.maverick.auth_app.entities.RefreshToken;
import com.maverick.auth_app.entities.User;
import com.maverick.auth_app.repositories.RefreshTokenRepository;
import com.maverick.auth_app.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.ConfigurationKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
@AllArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final CookiesService cookiesService;

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        logger.info("SuccessFull authentication");
        logger.info(authentication.toString());

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String registrationId = "unknown";
        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        logger.info("registration ID: " + registrationId);
        logger.info("oauth2 attributes: " + oAuth2User.getAttributes().toString());

        User user;
        switch (registrationId) {
            case "google" -> {
                String googleId = oAuth2User.getAttributes().getOrDefault("sub", "").toString();

                String emailId = oAuth2User.getAttributes().getOrDefault("email", "").toString();
                String name = oAuth2User.getAttributes().getOrDefault("name", "").toString();
                String picture = oAuth2User.getAttributes().getOrDefault("picture", "").toString();

                user = User
                        .builder()
                        .email(emailId)
                        .name(name)
                        .image(picture)
                        .enable(true)
                        .provider(Provider.GOOGLE)
                        .build();
                userRepository.findByEmail(emailId).ifPresentOrElse(u -> {
                    logger.info("user is already present in DB");
                    logger.info(u.toString());
                }, () -> {
                    userRepository.save(user);
                });
            }
            default -> {
                throw new RuntimeException("invalid registration Id");
            }
        }

        //create refresh token as it will generate access token also
        String jtiId = UUID.randomUUID().toString();
        RefreshToken refreshTokenObj = RefreshToken.builder()
                .jti(jtiId)
                .user(user)
                .revoked(false)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .build();
        refreshTokenRepository.save(refreshTokenObj);
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenObj.getJti());

        cookiesService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        response.getWriter().write("Login SuccessFull");
    }
}
