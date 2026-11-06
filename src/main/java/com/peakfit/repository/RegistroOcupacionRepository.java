package com.peakfit.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.peakfit.entity.RegistroOcupacion;

/** Consultas a la tabla registro_ocupacion. */
@Repository
public interface RegistroOcupacionRepository extends JpaRepository<RegistroOcupacion, Integer> {

    /** Último registro del gimnasio: sirve para saber cuánta gente hay ahora. */
    Optional<RegistroOcupacion> findFirstByIdGimnasioOrderByRegistroDesc(Integer idGimnasio);

    List<RegistroOcupacion> findTop200ByIdGimnasioOrderByRegistroDesc(Integer idGimnasio);

    List<RegistroOcupacion> findByIdGimnasioAndRegistroBetweenOrderByRegistroDesc(
            Integer idGimnasio, LocalDateTime desde, LocalDateTime hasta);

    /** Promedio de personas por día de la semana (0 = domingo) y hora. */
    @Query(value = "SELECT DAYOFWEEK(registro) - 1 AS diaSemana, HOUR(registro) AS hora, "
            + "AVG(personas) AS promedio FROM registro_ocupacion WHERE id_gimnasio = :id "
            + "GROUP BY diaSemana, hora ORDER BY diaSemana, hora", nativeQuery = true)
    List<PromedioHora> promedioPorHora(@Param("id") Integer id);

    /** Igual que el anterior, pero solo para un día de la semana. */
    @Query(value = "SELECT DAYOFWEEK(registro) - 1 AS diaSemana, HOUR(registro) AS hora, "
            + "AVG(personas) AS promedio FROM registro_ocupacion "
            + "WHERE id_gimnasio = :id AND DAYOFWEEK(registro) - 1 = :dia "
            + "GROUP BY diaSemana, hora ORDER BY diaSemana, hora", nativeQuery = true)
    List<PromedioHora> promedioPorHoraDeUnDia(@Param("id") Integer id, @Param("dia") Integer dia);
}