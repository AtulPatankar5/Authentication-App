package com.maverick.auth_app.dtos;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record ApiErrorResponse(

        int status,
        String error,
        String message,
        String path,
        OffsetDateTime timestamp
) {

    public static ApiErrorResponse of(int status,
                                      String error,
                                      String message,
                                      String path) {
        return new ApiErrorResponse(status, error, message, path, OffsetDateTime.now(ZoneOffset.UTC));
    }
}
