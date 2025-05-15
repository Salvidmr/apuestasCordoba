package com.miapp.apuestasCordoba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarPin(String destinatario, String nombreUsuario, String pin) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Tu PIN de seguridad - Arcanfield Road");
        mensaje.setText("Hola " + nombreUsuario + ",\n\nTu PIN de seguridad es: " + pin +
                "\n\nGuárdalo bien, ya que lo necesitarás para recuperar tu contraseña si la pierdes." +
                "\n\n¡Gracias por registrarte en Arcanfield Road!\n\n⚽️ Equipo de Arcanfield Road");
        mailSender.send(mensaje);
    }

    public void enviarAvisoDePartido(String destinatario, String nombreUsuario, String nombreCompeticion,
            String nombreLocal, String nombreVisitante) {

        String cuerpo = "Hola " + nombreUsuario + ",\n\n" +
                "📢 Se ha creado un nuevo partido en la competición: *" + nombreCompeticion + "*\n\n" +
                "🏟️ Partido:\n" +
                nombreLocal + " vs " + nombreVisitante + "\n\n" +
                "Ya puedes entrar en Arcanfield Road y realizar tu pronóstico.\n\n" +
                "¡Suerte 🍀 y a jugar!\n\n" +
                "— El equipo de Arcanfield Road ⚽";

        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Nuevo partido en " + nombreCompeticion);
        mensaje.setText(cuerpo);

        mailSender.send(mensaje);
    }

}
