package com.miapp.apuestasCordoba.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PinTemporalService {

    private static class DatosPin {
        private final String pin;
        private final LocalDateTime expiracion;

        public DatosPin(String pin, LocalDateTime expiracion) {
            this.pin = pin;
            this.expiracion = expiracion;
        }

        public String getPin() {
            return pin;
        }

        public LocalDateTime getExpiracion() {
            return expiracion;
        }
    }

    private final Map<String, DatosPin> pinTemporales = new ConcurrentHashMap<>();

    public void generarPin(String nombreUsuario) {
        String pin = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(15);
        pinTemporales.put(nombreUsuario, new DatosPin(pin, expiracion));
    }

    
    public String obtenerPin(String nombreUsuario) {
        DatosPin datos = pinTemporales.get(nombreUsuario);
        if (datos == null || LocalDateTime.now().isAfter(datos.getExpiracion())) {
            pinTemporales.remove(nombreUsuario); 
            return null;
        }
        return datos.getPin();
    }

    public boolean validarPin(String nombreUsuario, String pinIngresado) {
        DatosPin datos = pinTemporales.get(nombreUsuario);
        if (datos == null || LocalDateTime.now().isAfter(datos.getExpiracion())) {
            pinTemporales.remove(nombreUsuario);
            return false;
        }
        return datos.getPin().equals(pinIngresado);
    }

    public void eliminarPin(String nombreUsuario) {
        pinTemporales.remove(nombreUsuario);
    }
}
