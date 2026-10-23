package com.peakfit.controller;

import com.peakfit.entity.Favorito;
import com.peakfit.entity.Usuario;
import com.peakfit.model.OcupacionGimnasio;
import com.peakfit.repository.FavoritoRepository;
import com.peakfit.repository.GimnasioRepository;
import com.peakfit.repository.UsuarioRepository;
import com.peakfit.service.OcupacionGimnasioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Usuarios guardados en MySQL y sus gimnasios favoritos. */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarios;
    private final GimnasioRepository gimnasios;
    private final FavoritoRepository favoritos;
    private final OcupacionGimnasioService ocupacionService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuarioController(
            UsuarioRepository usuarios,
            GimnasioRepository gimnasios,
            FavoritoRepository favoritos,
            OcupacionGimnasioService ocupacionService
    ) {
        this.usuarios = usuarios;
        this.gimnasios = gimnasios;
        this.favoritos = favoritos;
        this.ocupacionService = ocupacionService;
    }

    /** Registra un usuario nuevo; la contraseña se guarda encriptada. */
    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario registrar(@Valid @RequestBody RegistroRequest request) {
        if (usuarios.existsByCorreo(request.correo())) {
            throw new IllegalStateException("Ya existe un usuario con ese correo.");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setCorreo(request.correo());
        usuario.setContrasena(encoder.encode(request.contrasena()));
        usuario.setRol("usuario");
        usuario.setFechaRegistro(LocalDate.now());
        return usuarios.save(usuario);
    }

    /** Verifica correo y contraseña. Todavía no entrega token (queda para el 100%). */
    @PostMapping("/login")
    public Usuario login(@Valid @RequestBody LoginRequest request) {
        return usuarios.findByCorreo(request.correo())
                .filter(u -> encoder.matches(request.contrasena(), u.getContrasena()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas."));
    }

    /** Devuelve los datos de un usuario (sin la contraseña). */
    @GetMapping("/{id}")
    public Usuario detalle(@PathVariable Integer id) {
        return buscarUsuario(id);
    }

    // ---------- Favoritos ----------

    /** Gimnasios favoritos del usuario con su ocupación actual. */
    @GetMapping("/{id}/favoritos")
    public List<OcupacionGimnasio> favoritos(@PathVariable Integer id) {
        buscarUsuario(id);
        return favoritos.findByIdUsuario(id).stream()
                .flatMap(f -> gimnasios.findById(f.getIdGimnasio()).stream())
                .filter(g -> Integer.valueOf(1).equals(g.getActivo()))
                .map(ocupacionService::ocupacionActual)
                .toList();
    }

    /** Agrega un gimnasio a los favoritos del usuario. */
    @PostMapping("/{id}/favoritos")
    @ResponseStatus(HttpStatus.CREATED)
    public Favorito agregarFavorito(@PathVariable Integer id, @Valid @RequestBody FavoritoRequest request) {
        buscarUsuario(id);
        if (!gimnasios.existsById(request.idGimnasio())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gimnasio no encontrado.");
        }
        if (favoritos.findByIdUsuarioAndIdGimnasio(id, request.idGimnasio()).isPresent()) {
            throw new IllegalStateException("Ese gimnasio ya está en favoritos.");
        }
        Favorito favorito = new Favorito();
        favorito.setIdUsuario(id);
        favorito.setIdGimnasio(request.idGimnasio());
        return favoritos.save(favorito);
    }

    /** Quita un gimnasio de los favoritos del usuario. */
    @DeleteMapping("/{id}/favoritos/{idGimnasio}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void quitarFavorito(@PathVariable Integer id, @PathVariable Integer idGimnasio) {
        Favorito favorito = favoritos.findByIdUsuarioAndIdGimnasio(id, idGimnasio)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorito no encontrado."));
        favoritos.delete(favorito);
    }

    private Usuario buscarUsuario(Integer id) {
        return usuarios.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    /** Datos para registrar un usuario. */
    public record RegistroRequest(
            @NotBlank String nombre,
            @NotBlank @Email String correo,
            @NotBlank @Size(min = 6) String contrasena
    ) {
    }

    /** Datos para iniciar sesión. */
    public record LoginRequest(@NotBlank String correo, @NotBlank String contrasena) {
    }

    /** Gimnasio que se quiere marcar como favorito. */
    public record FavoritoRequest(@NotNull Integer idGimnasio) {
    }
}