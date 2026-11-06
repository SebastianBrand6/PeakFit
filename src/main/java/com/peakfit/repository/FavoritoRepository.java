package com.peakfit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.peakfit.entity.Favorito;

/** Consultas a la tabla favorito. */
@Repository 
public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {

    List<Favorito> findByIdUsuario(Integer idUsuario);

    Optional<Favorito> findByIdUsuarioAndIdGimnasio(Integer idUsuario, Integer idGimnasio);
}