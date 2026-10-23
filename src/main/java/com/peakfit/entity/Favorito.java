package com.peakfit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "favorito")
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFavorito;

    private Integer idUsuario;

    private Integer idGimnasio;

    public Integer getIdFavorito() { return idFavorito; }
    public void setIdFavorito(Integer idFavorito) { this.idFavorito = idFavorito; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdGimnasio() { return idGimnasio; }
    public void setIdGimnasio(Integer idGimnasio) { this.idGimnasio = idGimnasio; }
}