package com.miapp.apuestasCordoba.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.model.Partido;
import com.miapp.apuestasCordoba.model.Usuario;

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

    public void enviarAvisoClasificacionActualizada(Partido partido) {
        Competicion competicion = partido.getCompeticion();
        String asunto = "Clasificación actualizada - Arcanfield Road";
        String cuerpo = "Se ha actualizado la clasificación tras el partido " +
                partido.getEquipoLocal().getNombre() + " " + partido.getGolesLocal() +
                " - " + partido.getGolesVisitante() + " " +
                partido.getEquipoVisitante().getNombre() + ".\n\n" +
                "Consulta la clasificación en la aplicación.";

        for (Usuario participante : competicion.getParticipantes()) {
            if (participante.getEmail() != null) {
                SimpleMailMessage mensaje = new SimpleMailMessage();
                mensaje.setTo(participante.getEmail());
                mensaje.setSubject(asunto);
                mensaje.setText(
                        "Hola " + participante.getNombreUsuario() + ",\n\n" + cuerpo + "\n\n- Arcanfield Road ⚽");
                mailSender.send(mensaje);
            }
        }
    }

    public void enviarPinTemporal(String destinatario, String nombreUsuario, String pin) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de contraseña - PIN Temporal");
        mensaje.setText("Hola " + nombreUsuario + ",\n\nTu PIN temporal para recuperar tu contraseña es: " + pin +
                "\n\nEste PIN expirará en 15 minutos.\n\nArcanfield Road ⚽");
        mailSender.send(mensaje);
    }

}
