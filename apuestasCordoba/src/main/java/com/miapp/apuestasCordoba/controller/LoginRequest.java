package com.miapp.apuestasCordoba.controller;

/**
 * Esta clase representa el cuerpo de una petición de login.
 * Se utiliza para asociar automáticamente los datos que el usuario envía
 * al iniciar sesión (nombre de usuario y contraseña).
 *
 * Fue creada para facilitar la autenticación desde el frontend.
 */
public class LoginRequest {
    private String nombreUsuario;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String nombreUsuario, String password) {
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
