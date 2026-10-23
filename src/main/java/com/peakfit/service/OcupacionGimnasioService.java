package com.peakfit.service;

import com.peakfit.config.GymConfigProperties;
import com.peakfit.entity.Gimnasio;
import com.peakfit.entity.RegistroOcupacion;
import com.peakfit.model.OccupancyStatus;
import com.peakfit.model.OcupacionGimnasio;
import com.peakfit.repository.RegistroOcupacionRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** Calcula la ocupación de cada gimnasio a partir de los registros guardados en MySQL. */
@Service
public class OcupacionGimnasioService {

    private final RegistroOcupacionRepository registros;
    private final GymConfigProperties config;

    public OcupacionGimnasioService(RegistroOcupacionRepository registros, GymConfigProperties config) {
        this.registros = registros;
        this.config = config;
    }

    /** Usa el último registro del gimnasio para saber cuánta gente hay y qué tan lleno está. */
    public OcupacionGimnasio ocupacionActual(Gimnasio gimnasio) {
        Optional<RegistroOcupacion> ultimo =
                registros.findFirstByIdGimnasioOrderByRegistroDesc(gimnasio.getIdGimnasio());
        if (ultimo.isEmpty()) {
            return new OcupacionGimnasio(gimnasio.getIdGimnasio(), gimnasio.getNombre(),
                    gimnasio.getCapacidadMaxima(), null, null, null, null);
        }
        int personas = ultimo.get().getPersonas();
        double porcentaje = porcentaje(personas, gimnasio.getCapacidadMaxima());
        return new OcupacionGimnasio(gimnasio.getIdGimnasio(), gimnasio.getNombre(),
                gimnasio.getCapacidadMaxima(), personas, porcentaje, estado(porcentaje),
                ultimo.get().getRegistro());
    }

    /** Porcentaje de ocupación con dos decimales. */
    public double porcentaje(int personas, Integer capacidadMaxima) {
        if (capacidadMaxima == null || capacidadMaxima <= 0) {
            return 0;
        }
        return Math.round(personas * 10000.0 / capacidadMaxima) / 100.0;
    }

    /** Asigna LOW, MODERATE, HIGH o CRITICAL con los mismos umbrales del application.yml. */
    public OccupancyStatus estado(double porcentaje) {
        if (porcentaje >= config.getCriticalThresholdPercent()) {
            return OccupancyStatus.CRITICAL;
        }
        if (porcentaje >= config.getHighThresholdPercent()) {
            return OccupancyStatus.HIGH;
        }
        if (porcentaje >= config.getModerateThresholdPercent()) {
            return OccupancyStatus.MODERATE;
        }
        return OccupancyStatus.LOW;
    }
}