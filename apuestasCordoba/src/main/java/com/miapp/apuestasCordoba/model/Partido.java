package com.miapp.apuestasCordoba.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidos")
public class Partido {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "equipo_local_id", nullable = false)
	private Equipo equipoLocal;

	@ManyToOne
	@JoinColumn(name = "equipo_visitante_id", nullable = false)
	private Equipo equipoVisitante;

	private LocalDateTime fechaHora; // Fecha y hora del partido (límite para apostar)

	private Integer golesLocal; // Resultado real
	private Integer golesVisitante;

	// Relación con competición
	@ManyToOne
	@JoinColumn(name = "competicion_id", nullable = false)
	private Competicion competicion;

	public Partido() {
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public Equipo getEquipoLocal() {
		return equipoLocal;
	}

	public void setEquipoLocal(Equipo equipoLocal) {
		this.equipoLocal = equipoLocal;
	}

	public Equipo getEquipoVisitante() {
		return equipoVisitante;
	}

	public void setEquipoVisitante(Equipo equipoVisitante) {
		this.equipoVisitante = equipoVisitante;
	}

	public LocalDateTime getFechaHora() {
		return fechaHora;
	}

	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}

	public Integer getGolesLocal() {
		return golesLocal;
	}

	public void setGolesLocal(Integer golesLocal) {
		this.golesLocal = golesLocal;
	}

	public Integer getGolesVisitante() {
		return golesVisitante;
	}

	public void setGolesVisitante(Integer golesVisitante) {
		this.golesVisitante = golesVisitante;
	}

	public Competicion getCompeticion() {
		return competicion;
	}

	public void setCompeticion(Competicion competicion) {
		this.competicion = competicion;
	}

	// Método para saber si el partido ya está cerrado
	public boolean estaCerrado() {
		return fechaHora.isBefore(LocalDateTime.now());
	}
}
