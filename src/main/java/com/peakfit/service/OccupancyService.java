package com.peakfit.service;

import com.peakfit.config.GymConfigProperties;
import com.peakfit.model.CapacityEvent;
import com.peakfit.model.CapacityUpdate;
import com.peakfit.model.GymConfig;
import com.peakfit.model.HourlyPeak;
import com.peakfit.model.OccupancyStatus;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Aplica las reglas de aforo y distribuye actualizaciones a los clientes en tiempo real. */
@Service
public class OccupancyService {

    private static final String CAPACITY_TOPIC = "/topic/capacity";
    private static final String CAPACITY_UPDATE_EVENT = "capacity_update";

    private final GymConfigProperties config;
    private final SimpMessagingTemplate messagingTemplate;
    private final Set<String> presentUsers = new HashSet<>();
    private final List<Instant> entryTimestamps = new ArrayList<>();

    public OccupancyService(
            GymConfigProperties config,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.config = config;
        this.messagingTemplate = messagingTemplate;
    }

    /** Devuelve una instantánea del aforo sin modificar el estado de los usuarios. */
    public synchronized CapacityUpdate currentCapacity() {
        return createUpdate(Instant.now());
    }

    /** Valida y registra una entrada, rechazando duplicados y el exceso de capacidad. */
    public synchronized CapacityUpdate registerEntry(String userId) {
        requireUserId(userId);
        if (presentUsers.contains(userId)) {
            throw new IllegalStateException("El usuario ya está registrado dentro del gimnasio.");
        }
        if (presentUsers.size() >= config.getMaxCapacity()) {
            throw new IllegalStateException("El gimnasio alcanzó su capacidad máxima.");
        }

        presentUsers.add(userId);
        Instant timestamp = Instant.now();
        entryTimestamps.add(timestamp);
        return publishUpdate(timestamp);
    }

    /** Registra la salida de una persona que debe figurar previamente dentro del gimnasio. */
    public synchronized CapacityUpdate registerExit(String userId) {
        requireUserId(userId);
        if (!presentUsers.remove(userId)) {
            throw new IllegalStateException("El usuario no figura dentro del gimnasio.");
        }
        return publishUpdate(Instant.now());
    }

    /** Devuelve los límites y umbrales activos para que los consulte la API. */
    public GymConfig gymConfig() {
        return new GymConfig(
                config.getMaxCapacity(),
                config.getModerateThresholdPercent(),
                config.getHighThresholdPercent(),
                config.getCriticalThresholdPercent()
        );
    }

    /** Agrupa las entradas por hora y devuelve las horas con mayor actividad. */
    public synchronized List<HourlyPeak> peakHours(int limit) {
        Map<Integer, Long> entriesByHour = entryTimestamps.stream()
                .collect(Collectors.groupingBy(
                        timestamp -> timestamp.atZone(ZoneId.systemDefault()).getHour(),
                        Collectors.counting()
                ));

        return entriesByHour.entrySet().stream()
                .map(entry -> new HourlyPeak(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingLong((@NonNull HourlyPeak peak) -> peak.entries()).reversed()
                        .thenComparingInt((@NonNull HourlyPeak peak) -> peak.hour()))
                .limit(limit)
                .toList();
    }

    /** Crea la actualización y la publica en el tema WebSocket de aforo. */
    private CapacityUpdate publishUpdate(Instant timestamp) {
        CapacityUpdate update = createUpdate(timestamp);
        messagingTemplate.convertAndSend(
                CAPACITY_TOPIC,
                new CapacityEvent(CAPACITY_UPDATE_EVENT, update)
        );
        return update;
    }

    /** Calcula el porcentaje y el nivel de ocupación para el instante indicado. */
    private CapacityUpdate createUpdate(Instant timestamp) {
        int currentOccupancy = presentUsers.size();
        double percentage = currentOccupancy * 100.0 / config.getMaxCapacity();
        return new CapacityUpdate(
                currentOccupancy,
                config.getMaxCapacity(),
                Math.round(percentage * 100.0) / 100.0,
                resolveStatus(percentage),
                timestamp
        );
    }

    /** Asigna el nivel correspondiente comparando el porcentaje con cada umbral. */
    private OccupancyStatus resolveStatus(double percentage) {
        if (percentage >= config.getCriticalThresholdPercent()) {
            return OccupancyStatus.CRITICAL;
        }
        if (percentage >= config.getHighThresholdPercent()) {
            return OccupancyStatus.HIGH;
        }
        if (percentage >= config.getModerateThresholdPercent()) {
            return OccupancyStatus.MODERATE;
        }
        return OccupancyStatus.LOW;
    }

    /** Rechaza identificadores nulos o vacíos antes de cambiar el estado del aforo. */
    private void requireUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId es obligatorio.");
        }
    }
}
