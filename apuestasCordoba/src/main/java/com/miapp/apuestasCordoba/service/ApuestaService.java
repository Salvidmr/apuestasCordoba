package com.miapp.apuestasCordoba.service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.miapp.apuestasCordoba.model.Apuesta;
import com.miapp.apuestasCordoba.model.Partido;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.ApuestaRepository;
import com.miapp.apuestasCordoba.repository.PartidoRepository;
import com.miapp.apuestasCordoba.repository.UsuarioRepository;

@Service
public class ApuestaService {

    @Autowired
    private ApuestaRepository apuestaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PartidoRepository partidoRepository;

    public String realizarOActualizarApuesta(Apuesta apuesta, Long usuarioId, Long partidoId) {
        Optional<Usuario> userOpt = usuarioRepository.findById(usuarioId);
        Optional<Partido> partidoOpt = partidoRepository.findById(partidoId);

        if (userOpt.isEmpty() || partidoOpt.isEmpty()) {
            return "Usuario o partido no encontrado.";
        }

        Usuario usuario = userOpt.get();
        Partido partido = partidoOpt.get();

        if (partido.getFechaHora().isBefore(LocalDateTime.now())) {
            return "El partido ya ha comenzado. No se puede apostar.";
        }

        Optional<Apuesta> apuestaExistenteOpt = apuestaRepository.findByUsuarioAndPartido(usuario, partido);

        Apuesta apuestaFinal = apuestaExistenteOpt.orElse(new Apuesta());
        apuestaFinal.setUsuario(usuario);
        apuestaFinal.setPartido(partido);
        apuestaFinal.setGolesLocal(apuesta.getGolesLocal());
        apuestaFinal.setGolesVisitante(apuesta.getGolesVisitante());
        apuestaFinal.setFechaApuesta(LocalDateTime.now());

        apuestaRepository.save(apuestaFinal);

        return apuestaExistenteOpt.isPresent()
            ? "Apuesta actualizada correctamente."
            : "Apuesta registrada correctamente.";
    }

    public String modificarApuesta(Long usuarioId, Long partidoId, Apuesta nuevosDatos) {
        Optional<Usuario> userOpt = usuarioRepository.findById(usuarioId);
        Optional<Partido> partidoOpt = partidoRepository.findById(partidoId);

        if (userOpt.isEmpty() || partidoOpt.isEmpty()) {
            return "Usuario o partido no encontrado.";
        }

        Usuario usuario = userOpt.get();
        Partido partido = partidoOpt.get();

        if (partido.getFechaHora().isBefore(LocalDateTime.now())) {
            return "No se puede modificar la apuesta, el partido ya ha comenzado.";
        }

        Optional<Apuesta> apuestaOpt = apuestaRepository.findByUsuarioAndPartido(usuario, partido);

        if (apuestaOpt.isEmpty()) {
            return "No existe una apuesta para este partido.";
        }

        Apuesta apuesta = apuestaOpt.get();
        apuesta.setGolesLocal(nuevosDatos.getGolesLocal());
        apuesta.setGolesVisitante(nuevosDatos.getGolesVisitante());
        apuesta.setFechaApuesta(LocalDateTime.now());

        apuestaRepository.save(apuesta);
        return "Apuesta modificada correctamente.";
    }

    public String calcularPuntos(Long partidoId) {
        Optional<Partido> partidoOpt = partidoRepository.findById(partidoId);

        if (partidoOpt.isEmpty()) {
            return "Partido no encontrado.";
        }

        Partido partido = partidoOpt.get();

        if (partido.getGolesLocal() == null || partido.getGolesVisitante() == null) {
            return "El resultado del partido aún no ha sido asignado.";
        }

        int puntosExacto = partido.getCompeticion().getPuntosPorResultadoExacto();
        int puntosAciertoSimple = partido.getCompeticion().getPuntosPorAciertoSimple();

        List<Apuesta> apuestas = apuestaRepository.findByPartidoId(partidoId);

        for (Apuesta apuesta : apuestas) {
            int puntos = 0;

            boolean exacto = apuesta.getGolesLocal() == partido.getGolesLocal()
                    && apuesta.getGolesVisitante() == partido.getGolesVisitante();

            boolean acertadoGanador = getResultado(apuesta.getGolesLocal(), apuesta.getGolesVisitante())
                    .equals(getResultado(partido.getGolesLocal(), partido.getGolesVisitante()));

            if (exacto) {
                puntos = puntosExacto;
            } else if (acertadoGanador) {
                puntos = puntosAciertoSimple;
            }

            // No se suma aquí, porque ahora los puntos no se guardan en Usuario
        }

        return "Puntos calculados correctamente.";
    }

    private String getResultado(int local, int visitante) {
        if (local > visitante) return "L";
        if (local < visitante) return "V";
        return "E";
    }

    public List<Apuesta> listarApuestasPorPartido(Long partidoId) {
        return apuestaRepository.findByPartidoId(partidoId);
    }

    public List<Apuesta> getApuestasDeUsuarioPorCompeticion(Long usuarioId, Long competicionId) {
        return apuestaRepository.findByUsuarioIdAndPartidoCompeticionId(usuarioId, competicionId);
    }

    public List<Map<String, Object>> obtenerClasificacionPorCompeticion(Long competicionId) {
        List<Apuesta> apuestas = apuestaRepository.findByPartido_Competicion_Id(competicionId);
        Map<String, Integer> puntosPorUsuario = new HashMap<>();
        Map<String, Long> idPorUsuario = new HashMap<>();

        for (Apuesta apuesta : apuestas) {
            Partido partido = apuesta.getPartido();

            if (partido.getGolesLocal() == null || partido.getGolesVisitante() == null) continue;

            int puntos = 0;

            boolean exacto = apuesta.getGolesLocal() == partido.getGolesLocal()
                    && apuesta.getGolesVisitante() == partido.getGolesVisitante();

            boolean aciertoSimple = getResultado(apuesta.getGolesLocal(), apuesta.getGolesVisitante())
                    .equals(getResultado(partido.getGolesLocal(), partido.getGolesVisitante()));

            if (exacto) {
                puntos = partido.getCompeticion().getPuntosPorResultadoExacto();
            } else if (aciertoSimple) {
                puntos = partido.getCompeticion().getPuntosPorAciertoSimple();
            }

            String nombre = apuesta.getUsuario().getNombreUsuario();
            puntosPorUsuario.merge(nombre, puntos, Integer::sum);
            idPorUsuario.put(nombre, apuesta.getUsuario().getId());
        }

        return puntosPorUsuario.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(entry -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", idPorUsuario.get(entry.getKey()));
                    userInfo.put("nombreUsuario", entry.getKey());
                    userInfo.put("puntos", entry.getValue());
                    return userInfo;
                })
                .collect(Collectors.toList());
    }

}
