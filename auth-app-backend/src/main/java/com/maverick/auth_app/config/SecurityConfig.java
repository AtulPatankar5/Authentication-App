package com.maverick.auth_app.config;

import com.maverick.auth_app.dtos.ApiErrorResponse;
import com.maverick.auth_app.security.JwtAuthentictionFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    public JwtAuthentictionFilter jwtAuthentictionFilter;
    public AuthenticationSuccessHandler successHandler;

    public SecurityConfig(JwtAuthentictionFilter jwtAuthentictionFilter, AuthenticationSuccessHandler successHandler) {
        this.jwtAuthentictionFilter = jwtAuthentictionFilter;
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.
                cors(Customizer.withDefaults()).
                csrf(AbstractHttpConfigurer::disable).
//                Don't create Http Session. For every request generate a JWT Token again. Server never remembers the user. JWt remembers
        sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).
                authorizeHttpRequests(authorizeRequest ->
                        authorizeRequest
                                // Allow CORS preflight requests
                                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers(AppConstant.AUTH_PUBLIC_URLS).permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 ->
                        oauth2.
                                successHandler(successHandler).
                                failureHandler(null))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    authException.printStackTrace();
                    response.setStatus(401);
                    response.setContentType("application/json");
                    String message = authException.getMessage();

                    String error = (String) request.getAttribute("error");
                    if (error != null) {
                        message = error;
                    }

//                    Map<String, String> errorMap = Map.of("message", message, "Status Code", Integer.toString(401));
                    var apiError = ApiErrorResponse.of(HttpStatus.UNAUTHORIZED.value(), "UnAuthorized Access", message, request.getRequestURI().toString());
                    var objectMapper = new ObjectMapper();
                    response.getWriter().write(objectMapper.writeValueAsString(apiError));
                }))
//        Register JWT Filter
//        it tell spring that : Incoming Request -> JWT Filter -> If token valid -> Spring Security ->Controller
                .addFilterBefore(jwtAuthentictionFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.front-end-url}") String corsUrls) {

        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.stream(corsUrls.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        config.setAllowedOrigins(origins);

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
