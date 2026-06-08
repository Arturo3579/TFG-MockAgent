package com.example.backend.exception;

public class UnauthorizedEndpointException extends RuntimeException {
    public UnauthorizedEndpointException(String message) {
        super(message);
    }
}
