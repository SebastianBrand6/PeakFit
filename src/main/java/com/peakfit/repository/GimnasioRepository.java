package com.peakfit.repository;

import com.peakfit.entity.Gimnasio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a la tabla gimnasio. */
public interface GimnasioRepository extends JpaRepository<Gimnasio, Integer> {

    List<Gimnasio> findByActivo(Integer activo);

    List<Gimnasio> findByActivoAndCiudadIgnoreCase(Integer activo, String ciudad);
}