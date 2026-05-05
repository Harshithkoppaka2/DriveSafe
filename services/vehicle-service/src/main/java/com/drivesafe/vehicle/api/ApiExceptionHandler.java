package com.drivesafe.vehicle.api;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class ApiExceptionHandler {
    public record ErrorResponse(String message) {}
    @ExceptionHandler(IllegalArgumentException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse badRequest(IllegalArgumentException ex) { return new ErrorResponse(ex.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst()
                .map(e -> e.getField() + ": " + e.getDefaultMessage()).orElse("Invalid request");
        return new ErrorResponse(message);
    }
}
