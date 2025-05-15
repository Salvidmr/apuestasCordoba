package com.miapp.apuestasCordoba.service;

import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.model.Equipo;
import com.miapp.apuestasCordoba.model.Partido;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.CompeticionRepository;
import com.miapp.apuestasCordoba.repository.EquipoRepository;
import com.miapp.apuestasCordoba.repository.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidoService {

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CompeticionRepository competicionRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    public String crearPartido(Partido partido, Long competicionId, Long localId, Long visitanteId) {
        Optional<Competicion> compOpt = competicionRepository.findById(competicionId);
        Optional<Equipo> localOpt = equipoRepository.findById(localId);
        Optional<Equipo> visitOpt = equipoRepository.findById(visitanteId);

        if (compOpt.isEmpty() || localOpt.isEmpty() || visitOpt.isEmpty()) {
            return "Datos incorrectos: competición o equipos no encontrados.";
        }

        Competicion competicion = compOpt.get();
        Equipo equipoLocal = localOpt.get();
        Equipo equipoVisitante = visitOpt.get();

        partido.setCompeticion(competicion);
        partido.setEquipoLocal(equipoLocal);
        partido.setEquipoVisitante(equipoVisitante);

        partidoRepository.save(partido);

        List<Usuario> participantes = competicion.getParticipantes();
        for (Usuario u : participantes) {
            emailService.enviarAvisoDePartido(
                    u.getEmail(),
                    u.getNombreUsuario(),
                    competicion.getNombre(),
                    equipoLocal.getNombre(),
                    equipoVisitante.getNombre());
        }

        return "Partido creado correctamente.";
    }

    public List<Partido> listarPorCompeticion(Long competicionId) {
        return partidoRepository.findByCompeticionId(competicionId);
    }
}
