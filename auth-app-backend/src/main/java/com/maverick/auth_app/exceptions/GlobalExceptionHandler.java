package com.maverick.auth_app.exceptions;

import com.maverick.auth_app.dtos.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice// global exception handling in REST APIs
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)// class to specify which exception a method should handle.
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException exception) {
        ErrorResponse internalServerError = new ErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(internalServerError);
    }
    @ExceptionHandler(IllegalArgumentException.class)// class to specify which exception a method should handle.
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException exception) {
        ErrorResponse IllegalArgumentException = new ErrorResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(IllegalArgumentException);
    }
}
