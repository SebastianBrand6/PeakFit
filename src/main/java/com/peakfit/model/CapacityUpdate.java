package com.peakfit.model;

import java.time.Instant;

/** Estado del aforo en un instante, usado en respuestas HTTP y notificaciones en vivo. */
public record CapacityUpdate(
        int currentOccupancy,
        int maxCapacity,
        double occupancyPercentage,
        OccupancyStatus status,
        Instant timestamp
) {
}
