package com.peakfit.controller;

import com.peakfit.model.HourlyPeak;
import com.peakfit.service.OccupancyService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Expone estadísticas de ocupación calculadas a partir de las entradas registradas. */
@Validated
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final OccupancyService occupancyService;

    public AnalyticsController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    /** Devuelve las horas con más entradas, limitando la cantidad de resultados. */
    @GetMapping("/peak-hours")
    public List<HourlyPeak> peakHours(
            @RequestParam(defaultValue = "5") @Min(1) @Max(24) int limit
    ) {
        return occupancyService.peakHours(limit);
    }
}
