package com.miapp.apuestasCordoba.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "competiciones")
public class Competicion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;
	private String descripcion;

	private LocalDateTime fechaCreacion = LocalDateTime.now();

	private LocalDateTime fechaFin;

	private int puntosPorResultadoExacto;
	private int puntosPorAciertoSimple;

	@ManyToOne
	@JoinColumn(name = "admin_id", nullable = false)
	private Usuario administrador;

	@ManyToMany
	@JoinTable(
		name = "usuarios_competicion",
		joinColumns = @JoinColumn(name = "competicion_id"),
		inverseJoinColumns = @JoinColumn(name = "usuario_id")
	)
	private List<Usuario> participantes = new ArrayList<>();

	public Competicion() {
		this.puntosPorResultadoExacto = 3;
		this.puntosPorAciertoSimple = 1;
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

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public LocalDateTime getFechaFin() {
		return fechaFin;
	}

	public void setFechaFin(LocalDateTime fechaFin) {
		this.fechaFin = fechaFin;
	}

	public int getPuntosPorResultadoExacto() {
		return puntosPorResultadoExacto;
	}

	public void setPuntosPorResultadoExacto(int puntosPorResultadoExacto) {
		this.puntosPorResultadoExacto = puntosPorResultadoExacto;
	}

	public int getPuntosPorAciertoSimple() {
		return puntosPorAciertoSimple;
	}

	public void setPuntosPorAciertoSimple(int puntosPorAciertoSimple) {
		this.puntosPorAciertoSimple = puntosPorAciertoSimple;
	}

	public Usuario getAdministrador() {
		return administrador;
	}

	public void setAdministrador(Usuario administrador) {
		this.administrador = administrador;
	}

	public List<Usuario> getParticipantes() {
		return participantes;
	}

	public void setParticipantes(List<Usuario> participantes) {
		this.participantes = participantes;
	}

	public boolean estaFinalizada() {
		return fechaFin != null && LocalDateTime.now().isAfter(fechaFin);
	}
}
