package com.maverick.auth_app.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Auth Application Build by Atul",
                description = "Generic auth app that can be used by any application",
                contact = @Contact(
                        name = "Atul Santosh Patankar",
                        email = "atul@gmail.com",
                        url = "https://maverick.com"
                ),
                version = "1.0",
                summary = "This app is very useful if you want to use authentication in your application"
        ),
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        })

@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class APIDocConfig {


}
