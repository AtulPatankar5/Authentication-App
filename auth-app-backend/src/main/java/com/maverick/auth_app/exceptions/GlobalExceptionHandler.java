package com.maverick.auth_app.exceptions;

import com.maverick.auth_app.dtos.ApiErrorResponse;
import com.maverick.auth_app.dtos.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.security.auth.login.CredentialExpiredException;

@RestControllerAdvice// global exception handling in REST APIs
public class GlobalExceptionHandler {

    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({DisabledException.class, UsernameNotFoundException.class, BadCredentialsException.class, CredentialExpiredException.class, AuthenticationException.class})
    public ResponseEntity<ApiErrorResponse> handleAuthException(Exception e, HttpServletRequest request) {
        logger.info("Exception :{}" + e.getClass().getName());
        ApiErrorResponse badRequest = ApiErrorResponse.of(HttpStatus.BAD_REQUEST.value(), "Bad Request", e.getMessage(), request.getRequestURI());
        return ResponseEntity.badRequest().body(badRequest);
    }

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
