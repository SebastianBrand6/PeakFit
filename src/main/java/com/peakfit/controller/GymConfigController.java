package com.peakfit.controller;

import com.peakfit.model.GymConfig;
import com.peakfit.service.OccupancyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Expone la configuración vigente del gimnasio mediante HTTP. */
@RestController
@RequestMapping("/api/gym")
public class GymConfigController {

    private final OccupancyService occupancyService;

    public GymConfigController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    /** Devuelve el aforo máximo y los umbrales de ocupación configurados. */
    @GetMapping("/config")
    public GymConfig config() {
        return occupancyService.gymConfig();
    }
}
