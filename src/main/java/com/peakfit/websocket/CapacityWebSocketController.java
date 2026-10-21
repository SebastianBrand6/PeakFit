package com.peakfit.websocket;

import com.peakfit.controller.OccupancyController.OccupancyRequest;
import com.peakfit.model.CapacityUpdate;
import com.peakfit.service.OccupancyService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

/** Atiende mensajes STOMP para registrar entradas y salidas en tiempo real. */
@Controller
@Validated
public class CapacityWebSocketController {

    private final OccupancyService occupancyService;

    public CapacityWebSocketController(OccupancyService occupancyService) {
        this.occupancyService = occupancyService;
    }

    /** Procesa una entrada enviada al destino STOMP `/app/capacity/entry`. */
    @MessageMapping("/capacity/entry")
    public CapacityUpdate registerEntry(@Valid OccupancyRequest request) {
        return occupancyService.registerEntry(request.userId());
    }

    /** Procesa una salida enviada al destino STOMP `/app/capacity/exit`. */
    @MessageMapping("/capacity/exit")
    public CapacityUpdate registerExit(@Valid OccupancyRequest request) {
        return occupancyService.registerExit(request.userId());
    }
}
