package com.miapp.apuestasCordoba.model;

import jakarta.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	private String escudoUrl; // URL de la imagen del escudo

	public Equipo() {
	}

	public Equipo(String nombre, String escudoUrl) {
		this.nombre = nombre;
		this.escudoUrl = escudoUrl;
	}

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getEscudoUrl() {
		return escudoUrl;
	}

	public void setEscudoUrl(String escudoUrl) {
		this.escudoUrl = escudoUrl;
	}
}
