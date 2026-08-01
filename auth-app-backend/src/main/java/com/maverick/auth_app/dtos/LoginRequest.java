package com.maverick.auth_app.dtos;

public record LoginRequest(
        String email,
        String password
        ) {

    public static LoginRequest of(String email, String password) {
        return new LoginRequest(email, password);
    }
}
