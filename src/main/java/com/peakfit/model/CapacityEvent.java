package com.peakfit.model;

/** Sobre de evento enviado por WebSocket con el tipo de evento y el aforo actualizado. */
public record CapacityEvent(String event, CapacityUpdate data) {
}
