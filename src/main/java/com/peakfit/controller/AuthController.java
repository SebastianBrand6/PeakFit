package com.peakfit.controller;

import com.peakfit.model.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Publica las rutas de autenticación, pendientes de conectar a un proveedor de identidad. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /** Recibe credenciales; responde 501 hasta que se configure un proveedor de identidad. */
    @PostMapping("/login")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    public void login(@RequestBody LoginRequest request) {
        throw new ResponseStatusException(
                HttpStatus.NOT_IMPLEMENTED,
                "Configura un proveedor de identidad antes de habilitar el inicio de sesión."
        );
    }

    /** Recibe el encabezado de autorización; responde 501 mientras no exista autenticación. */
    @GetMapping("/profile")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    public Usuario profile(@RequestHeader("Authorization") String authorization) {
        throw new ResponseStatusException(
                HttpStatus.NOT_IMPLEMENTED,
                "Configura autenticación y autorización antes de exponer perfiles."
        );
    }

    /** Formato JSON esperado para solicitar el inicio de sesión. */
    public record LoginRequest(String email, String password) {
    }
}
