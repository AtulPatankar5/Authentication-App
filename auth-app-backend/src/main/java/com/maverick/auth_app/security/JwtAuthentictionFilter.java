package com.maverick.auth_app.security;

import com.maverick.auth_app.helpers.UserHelper;
import com.maverick.auth_app.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class JwtAuthentictionFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepo;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthentictionFilter.class);

    //Skips the unnecessary calling of filter to check the headers of requesrt for /api/v1/auth
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/auth");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

//        Read Authorization header
        String header = request.getHeader("Authorization");
        logger.info(
                "Request: {} {} | Authorization: {}",
                request.getMethod(),
                request.getRequestURI(),
                header
        );
        //Check whether token exists
        if (header != null && header.startsWith("Bearer ")) {
//            Extract JWT
            String token = header.substring(7);
            try {
//                Verify token type
                if (!jwtService.isAccessToken(token)) {

                    filterChain.doFilter(request, response);
                    return;
                }
//              Check expiry,Secret Key and signature
                Jws<Claims> parsedClaims = jwtService.parse(token);
//              Read JWT Payload
                Claims payload = parsedClaims.getPayload();
                String userId = payload.getSubject();
                UUID id = UserHelper.parseToUUID(userId);
//                Load user from database
                userRepo.findById(id).ifPresent(user -> {
                            if (user.isEnabled()) {
                                List<GrantedAuthority> authorities = user.getRoles() == null ? List.of() :
                                        user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());

//                              Create Authentication
                                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        user.getEmail(),
                                        null,
                                        authorities
                                );
//                              Attach Request Details
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                                Store in SecurityContext
                                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                                    SecurityContextHolder.getContext().setAuthentication(authentication);
                                }
                            }
                        }
                );

            } catch (ExpiredJwtException e) {
                request.setAttribute("error", "Token Expired");
            } catch (Exception e) {
                request.setAttribute("error", "Invalid Token");
            }
        }

//        Continue Request
        filterChain.doFilter(request, response);
    }


}
