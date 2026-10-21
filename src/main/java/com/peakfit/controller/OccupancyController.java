package com.peakfit.controller;

import com.peakfit.model.CapacityUpdate;
import com.peakfit.service.OccupancyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Expone las consultas y operaciones HTTP de entrada y salida del gimnasio. */
@RestController
@RequestMapping("/api/occupancy")
public class OccupancyController {

    private final OccupancyService occupancyService;

    public OccupancyController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    /** Devuelve el aforo actual junto con el límite y el estado de ocupación. */
    @GetMapping
    public CapacityUpdate currentCapacity() {
        return occupancyService.currentCapacity();
    }

    /** Registra la entrada del usuario indicado y devuelve el aforo actualizado. */
    @PostMapping("/entries")
    public CapacityUpdate registerEntry(@Valid @RequestBody OccupancyRequest request) {
        return occupancyService.registerEntry(request.userId());
    }

    /** Registra la salida del usuario indicado y devuelve el aforo actualizado. */
    @PostMapping("/exits")
    public CapacityUpdate registerExit(@Valid @RequestBody OccupancyRequest request) {
        return occupancyService.registerExit(request.userId());
    }

    /** Cuerpo de las solicitudes de entrada y salida; exige un identificador no vacío. */
    public record OccupancyRequest(@NotBlank String userId) {
    }
}
