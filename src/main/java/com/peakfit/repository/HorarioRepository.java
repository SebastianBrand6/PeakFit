package com.peakfit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.peakfit.entity.Horario;

/** Consultas a la tabla horario. */
@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {

    List<Horario> findByIdGimnasioOrderByDiaSemana(Integer idGimnasio);

    Optional<Horario> findByIdGimnasioAndDiaSemana(Integer idGimnasio, Integer diaSemana);
}