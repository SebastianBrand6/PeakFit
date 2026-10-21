package com.peakfit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Convierte errores de las operaciones de aforo en respuestas HTTP claras. */
@RestControllerAdvice
public class OccupancyExceptionHandler {

    /** Responde con 409 cuando una operación no puede completarse por el estado actual. */
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError handleConflict(IllegalStateException exception) {
        return new ApiError(exception.getMessage());
    }

    /** Responde con 400 cuando una solicitud contiene un argumento inválido. */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleBadRequest(IllegalArgumentException exception) {
        return new ApiError(exception.getMessage());
    }

    /** Forma JSON usada para describir un error de la API. */
    public record ApiError(String message) {
    }
}
