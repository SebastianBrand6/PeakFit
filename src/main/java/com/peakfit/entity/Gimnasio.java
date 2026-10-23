package com.peakfit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gimnasio")
public class Gimnasio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idGimnasio;

    private String nombre;

    private String direccion;

    private String ciudad;

    private String telefono;

    private Integer capacidadMaxima;

    private Integer activo;

    public Integer getIdGimnasio() { return idGimnasio; }
    public void setIdGimnasio(Integer idGimnasio) { this.idGimnasio = idGimnasio; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Integer getCapacidadMaxima() { return capacidadMaxima; }
    public void setCapacidadMaxima(Integer capacidadMaxima) { this.capacidadMaxima = capacidadMaxima; }

    public Integer getActivo() { return activo; }
    public void setActivo(Integer activo) { this.activo = activo; }
}