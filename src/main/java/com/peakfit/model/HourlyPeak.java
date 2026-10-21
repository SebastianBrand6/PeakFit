package com.peakfit.model;

/** Cantidad de entradas registradas durante una hora del día. */
public record HourlyPeak(int hour, long entries) {
}
