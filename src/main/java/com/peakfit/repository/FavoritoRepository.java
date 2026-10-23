package com.peakfit.repository;

import com.peakfit.entity.Favorito;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas a la tabla favorito. */
public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {

    List<Favorito> findByIdUsuario(Integer idUsuario);

    Optional<Favorito> findByIdUsuarioAndIdGimnasio(Integer idUsuario, Integer idGimnasio);
}