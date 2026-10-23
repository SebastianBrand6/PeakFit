package com.peakfit.model;

import java.time.LocalDateTime;

/** Ocupación actual de un gimnasio; los datos de ocupación son null si aún no hay registros. */
public record OcupacionGimnasio(
        Integer idGimnasio,
        String nombre,
        Integer capacidadMaxima,
        Integer personas,
        Double porcentaje,
        OccupancyStatus estado,
        LocalDateTime actualizadoEn
) {
}