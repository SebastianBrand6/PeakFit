package com.peakfit.controller;

import com.peakfit.entity.Usuario;
import com.peakfit.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Publica las rutas de autenticación con validación básica y perfil del usuario autenticado. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    /** Valida correo y contraseña y devuelve el usuario autenticado sin la contraseña. */
    @PostMapping("/login")
    public Usuario login(@Valid @RequestBody LoginRequest request) {
        String correo = request.email() == null ? "" : request.email().trim();
        String password = request.password() == null ? "" : request.password();

        Usuario usuario = usuarios.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));

        if (!encoder.matches(password, usuario.getContrasena())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas.");
        }

        return usuario;
    }

    /** Obtiene el perfil del usuario usando Authorization: Bearer <idUsuario> o Basic <email:password>. */
    @GetMapping("/profile")
    public Usuario profile(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || authorization.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Falta el encabezado Authorization.");
        }

        Integer userId = resolveUserId(authorization);
        return usuarios.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autorizado."));
    }

    private Integer resolveUserId(String authorizationHeader) {
        String header = authorizationHeader.trim();

        if (header.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return parseUserId(header.substring(7).trim());
        }

        if (header.regionMatches(true, 0, "Basic ", 0, 6)) {
            String credentials = new String(Base64.getDecoder().decode(header.substring(6).trim()), StandardCharsets.UTF_8);
            int separator = credentials.indexOf(':');
            if (separator < 0) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales de autorización inválidas.");
            }
            String email = credentials.substring(0, separator).trim();
            String password = credentials.substring(separator + 1).trim();
            return usuarios.findByCorreo(email)
                    .filter(usuario -> encoder.matches(password, usuario.getContrasena()))
                    .map(Usuario::getIdUsuario)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));
        }

        return parseUserId(header);
    }

    private Integer parseUserId(String rawValue) {
        String value = rawValue.trim();
        if (value.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Falta el identificador del usuario.");
        }

        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException ex) {
            return usuarios.findByCorreo(value)
                    .map(Usuario::getIdUsuario)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autorizado."));
        }
    }

    /** Formato JSON esperado para solicitar el inicio de sesión. */
    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }
}
