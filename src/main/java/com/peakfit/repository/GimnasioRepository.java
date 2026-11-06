package com.peakfit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.peakfit.entity.Gimnasio;

/** Consultas a la tabla gimnasio. */
@Repository
public interface GimnasioRepository extends JpaRepository<Gimnasio, Integer> {

    List<Gimnasio> findByActivo(Integer activo);

    List<Gimnasio> findByActivoAndCiudadIgnoreCase(Integer activo, String ciudad);
}