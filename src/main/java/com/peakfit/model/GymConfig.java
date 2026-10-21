package com.peakfit.model;

/** Valores de capacidad y umbrales que la API devuelve para el gimnasio. */
public record GymConfig(
        int maxCapacity,
        int moderateThresholdPercent,
        int highThresholdPercent,
        int criticalThresholdPercent
) {
}
