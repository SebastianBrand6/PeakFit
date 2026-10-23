package com.peakfit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_ocupacion")
public class RegistroOcupacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRegistro;

    private Integer idGimnasio;

    private Integer idUsuario;

    private Integer personas;

    private String fuente;

    private LocalDateTime registro;

    public Integer getIdRegistro() { return idRegistro; }
    public void setIdRegistro(Integer idRegistro) { this.idRegistro = idRegistro; }

    public Integer getIdGimnasio() { return idGimnasio; }
    public void setIdGimnasio(Integer idGimnasio) { this.idGimnasio = idGimnasio; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getPersonas() { return personas; }
    public void setPersonas(Integer personas) { this.personas = personas; }

    public String getFuente() { return fuente; }
    public void setFuente(String fuente) { this.fuente = fuente; }

    public LocalDateTime getRegistro() { return registro; }
    public void setRegistro(LocalDateTime registro) { this.registro = registro; }
}