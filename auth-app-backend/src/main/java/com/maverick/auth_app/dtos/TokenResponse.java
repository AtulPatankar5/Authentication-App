package com.maverick.auth_app.dtos;

import org.springframework.http.HttpStatus;

public record TokenResponse(

        String accessToken,
        String refreshToken,
        long expiresIn,
        String tokenType,
        UserDtos userDto
) {

    public static TokenResponse of(String accessToken, String refreshToken, long expiresIn, UserDtos userDtos) {
        return new TokenResponse(accessToken, refreshToken, expiresIn, "Bearer", userDtos);
    }
}
