package com.miapp.apuestasCordoba.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "apuestas")
public class Apuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int golesLocal;
    private int golesVisitante;

    private int puntos = 0; // Nuevo campo para almacenar puntos por apuesta

    private LocalDateTime fechaApuesta = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "partido_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Partido partido;

    public Apuesta() {}

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public int getGolesLocal() {
        return golesLocal;
    }

    public void setGolesLocal(int golesLocal) {
        this.golesLocal = golesLocal;
    }

    public int getGolesVisitante() {
        return golesVisitante;
    }

    public void setGolesVisitante(int golesVisitante) {
        this.golesVisitante = golesVisitante;
    }

    public int getPuntos() {
        return puntos;
    }

    public void setPuntos(int puntos) {
        this.puntos = puntos;
    }

    public LocalDateTime getFechaApuesta() {
        return fechaApuesta;
    }

    public void setFechaApuesta(LocalDateTime fechaApuesta) {
        this.fechaApuesta = fechaApuesta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }
}
