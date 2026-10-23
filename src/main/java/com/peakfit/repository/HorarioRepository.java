package com.peakfit.repository;

import com.peakfit.entity.Horario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a la tabla horario. */
public interface HorarioRepository extends JpaRepository<Horario, Integer> {

    List<Horario> findByIdGimnasioOrderByDiaSemana(Integer idGimnasio);

    Optional<Horario> findByIdGimnasioAndDiaSemana(Integer idGimnasio, Integer diaSemana);
}