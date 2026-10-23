package com.peakfit.model;

/** Promedio de personas en un gimnasio para un día de la semana y una hora (0 = domingo). */
public record PromedioPorHora(
        int diaSemana,
        int hora,
        double promedioPersonas,
        double porcentaje,
        OccupancyStatus estado
) {
}