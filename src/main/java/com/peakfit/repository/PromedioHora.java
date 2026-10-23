package com.peakfit.repository;

/** Resultado de la consulta de promedio de personas por día y hora. */
public interface PromedioHora {

    Integer getDiaSemana();

    Integer getHora();

    Double getPromedio();
}