package com.miapp.apuestasCordoba.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuarios")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String nombreUsuario;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String nombreYapellidos;

	@Column(unique = true)
	private String pin;

	@Column(nullable = false)
	private String rol; // "admin" o "user"

	// @Column(nullable = false)
	// private Integer puntos = 0;

	private LocalDateTime fechaRegistro = LocalDateTime.now();

	@ManyToMany(mappedBy = "participantes")
	@JsonIgnore
	private List<Competicion> competiciones = new ArrayList<>();

	public Usuario() {
	}

	public Usuario(String nombreUsuario, String email, String password, String rol) {
		this.nombreUsuario = nombreUsuario;
		this.email = email;
		this.password = password;
		this.rol = rol;
		// this.puntos = 0;
		this.fechaRegistro = LocalDateTime.now();
	}

	// Getters y Setters

	public Long getId() {
		return id;
	}

	public String getNombreUsuario() {
		return nombreUsuario;
	}

	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}
	//
	// public Integer getPuntos() {
	// return puntos;
	// }
	//
	// public void setPuntos(Integer puntos) {
	// this.puntos = puntos;
	// }

	public LocalDateTime getFechaRegistro() {
		return fechaRegistro;
	}

	public void setFechaRegistro(LocalDateTime fechaRegistro) {
		this.fechaRegistro = fechaRegistro;
	}

	public List<Competicion> getCompeticiones() {
		return competiciones;
	}

	public void setCompeticiones(List<Competicion> competiciones) {
		this.competiciones = competiciones;
	}

	public String getNombreYapellidos() {
		return nombreYapellidos;
	}

	public void setNombreYapellidos(String nombreYapellidos) {
		this.nombreYapellidos = nombreYapellidos;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

}