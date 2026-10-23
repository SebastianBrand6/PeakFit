package com.peakfit.controller;

import com.peakfit.entity.Gimnasio;
import com.peakfit.entity.Horario;
import com.peakfit.entity.RegistroOcupacion;
import com.peakfit.model.OcupacionGimnasio;
import com.peakfit.model.PromedioPorHora;
import com.peakfit.repository.GimnasioRepository;
import com.peakfit.repository.HorarioRepository;
import com.peakfit.repository.PromedioHora;
import com.peakfit.repository.RegistroOcupacionRepository;
import com.peakfit.repository.UsuarioRepository;
import com.peakfit.service.OcupacionGimnasioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Gimnasios guardados en MySQL: datos, horarios y ocupación. */
@RestController
@RequestMapping("/api/gimnasios")
public class GimnasioController {

    private final GimnasioRepository gimnasios;
    private final HorarioRepository horarios;
    private final RegistroOcupacionRepository registros;
    private final UsuarioRepository usuarios;
    private final OcupacionGimnasioService ocupacionService;

    public GimnasioController(
            GimnasioRepository gimnasios,
            HorarioRepository horarios,
            RegistroOcupacionRepository registros,
            UsuarioRepository usuarios,
            OcupacionGimnasioService ocupacionService
    ) {
        this.gimnasios = gimnasios;
        this.horarios = horarios;
        this.registros = registros;
        this.usuarios = usuarios;
        this.ocupacionService = ocupacionService;
    }

    // ---------- Gimnasios ----------

    /** Lista los gimnasios activos; se puede filtrar con ?ciudad=Medellín. */
    @GetMapping
    public List<Gimnasio> listar(@RequestParam(required = false) String ciudad) {
        if (ciudad != null && !ciudad.isBlank()) {
            return gimnasios.findByActivoAndCiudadIgnoreCase(1, ciudad);
        }
        return gimnasios.findByActivo(1);
    }

    /** Devuelve un gimnasio por su id. */
    @GetMapping("/{id}")
    public Gimnasio detalle(@PathVariable Integer id) {
        return buscar(id);
    }

    /** Crea un gimnasio nuevo (queda activo). */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Gimnasio crear(@Valid @RequestBody GimnasioRequest request) {
        Gimnasio gimnasio = new Gimnasio();
        copiar(request, gimnasio);
        gimnasio.setActivo(1);
        return gimnasios.save(gimnasio);
    }

    /** Actualiza los datos de un gimnasio. */
    @PutMapping("/{id}")
    public Gimnasio actualizar(@PathVariable Integer id, @Valid @RequestBody GimnasioRequest request) {
        Gimnasio gimnasio = buscar(id);
        copiar(request, gimnasio);
        return gimnasios.save(gimnasio);
    }

    /** Desactiva el gimnasio (no se borra de la base de datos). */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Integer id) {
        Gimnasio gimnasio = buscar(id);
        gimnasio.setActivo(0);
        gimnasios.save(gimnasio);
    }

    // ---------- Horarios ----------

    /** Devuelve el horario de atención de cada día. */
    @GetMapping("/{id}/horarios")
    public List<Horario> horarios(@PathVariable Integer id) {
        buscar(id);
        return horarios.findByIdGimnasioOrderByDiaSemana(id);
    }

    /** Crea o actualiza el horario de un día de la semana (0 = domingo ... 6 = sábado). */
    @PutMapping("/{id}/horarios")
    public Horario guardarHorario(@PathVariable Integer id, @Valid @RequestBody HorarioRequest request) {
        buscar(id);
        Horario horario = horarios.findByIdGimnasioAndDiaSemana(id, request.diaSemana())
                .orElseGet(Horario::new);
        horario.setIdGimnasio(id);
        horario.setDiaSemana(request.diaSemana());
        horario.setHoraApertura(request.horaApertura());
        horario.setHoraCierre(request.horaCierre());
        return horarios.save(horario);
    }

    // ---------- Ocupación ----------

    /** Cuánta gente hay ahora en el gimnasio y si está vacío, moderado, alto o crítico. */
    @GetMapping("/{id}/ocupacion")
    public OcupacionGimnasio ocupacionActual(@PathVariable Integer id) {
        OcupacionGimnasio ocupacion = ocupacionService.ocupacionActual(buscar(id));
        if (ocupacion.personas() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Este gimnasio todavía no tiene registros de ocupación.");
        }
        return ocupacion;
    }

    /** Guarda un nuevo registro de cuántas personas hay en el gimnasio. */
    @PostMapping("/{id}/ocupacion")
    @ResponseStatus(HttpStatus.CREATED)
    public OcupacionGimnasio registrarOcupacion(
            @PathVariable Integer id,
            @Valid @RequestBody OcupacionRequest request
    ) {
        Gimnasio gimnasio = buscar(id);
        if (gimnasio.getCapacidadMaxima() != null && request.personas() > gimnasio.getCapacidadMaxima()) {
            throw new IllegalArgumentException("personas no puede superar la capacidad máxima ("
                    + gimnasio.getCapacidadMaxima() + ").");
        }
        if (request.idUsuario() != null && !usuarios.existsById(request.idUsuario())) {
            throw new IllegalArgumentException("El usuario indicado no existe.");
        }

        RegistroOcupacion registro = new RegistroOcupacion();
        registro.setIdGimnasio(id);
        registro.setIdUsuario(request.idUsuario());
        registro.setPersonas(request.personas());
        registro.setFuente(request.fuente() == null || request.fuente().isBlank() ? "admin" : request.fuente());
        registro.setRegistro(LocalDateTime.now());
        registros.save(registro);
        return ocupacionService.ocupacionActual(gimnasio);
    }

    /** Historial de registros; con ?fecha=2026-10-12 se limita a ese día (máximo 200 registros). */
    @GetMapping("/{id}/ocupacion/historial")
    public List<RegistroOcupacion> historial(
            @PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha
    ) {
        buscar(id);
        if (fecha == null) {
            return registros.findTop200ByIdGimnasioOrderByRegistroDesc(id);
        }
        return registros.findByIdGimnasioAndRegistroBetweenOrderByRegistroDesc(
                id, fecha.atStartOfDay(), fecha.plusDays(1).atStartOfDay().minusNanos(1));
    }

    /** Promedio de personas por día y hora: sirve para saber a qué horas suele estar vacío. */
    @GetMapping("/{id}/ocupacion/promedio")
    public List<PromedioPorHora> promedio(
            @PathVariable Integer id,
            @RequestParam(required = false) @Min(0) @Max(6) Integer dia
    ) {
        Gimnasio gimnasio = buscar(id);
        List<PromedioHora> filas = dia == null
                ? registros.promedioPorHora(id)
                : registros.promedioPorHoraDeUnDia(id, dia);
        return filas.stream().map(fila -> {
            double porcentaje = ocupacionService.porcentaje(
                    (int) Math.round(fila.getPromedio()), gimnasio.getCapacidadMaxima());
            return new PromedioPorHora(
                    fila.getDiaSemana(),
                    fila.getHora(),
                    Math.round(fila.getPromedio() * 100.0) / 100.0,
                    porcentaje,
                    ocupacionService.estado(porcentaje));
        }).toList();
    }

    // ---------- Ayudas internas ----------

    private Gimnasio buscar(Integer id) {
        return gimnasios.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Gimnasio no encontrado."));
    }

    private void copiar(GimnasioRequest request, Gimnasio gimnasio) {
        gimnasio.setNombre(request.nombre());
        gimnasio.setDireccion(request.direccion());
        gimnasio.setCiudad(request.ciudad());
        gimnasio.setTelefono(request.telefono());
        gimnasio.setCapacidadMaxima(request.capacidadMaxima());
    }

    /** Datos para crear o actualizar un gimnasio. */
    public record GimnasioRequest(
            @NotBlank String nombre,
            @NotBlank String direccion,
            @NotBlank String ciudad,
            String telefono,
            @NotNull @Min(1) Integer capacidadMaxima
    ) {
    }

    /** Datos para guardar el horario de un día. */
    public record HorarioRequest(
            @NotNull @Min(0) @Max(6) Integer diaSemana,
            @NotNull LocalTime horaApertura,
            @NotNull LocalTime horaCierre
    ) {
    }

    /** Datos para registrar cuántas personas hay en el gimnasio. */
    public record OcupacionRequest(
            @NotNull @Min(0) Integer personas,
            String fuente,
            Integer idUsuario
    ) {
    }
}