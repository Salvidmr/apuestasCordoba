package com.miapp.apuestasCordoba.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.CompeticionRepository;
import com.miapp.apuestasCordoba.repository.UsuarioRepository;

@Service
public class CompeticionService {

    @Autowired
    private CompeticionRepository competicionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String crearCompeticion(Competicion competicion, Long adminId) {
        Optional<Usuario> adminOpt = usuarioRepository.findById(adminId);

        if (adminOpt.isEmpty()) {
            return "Administrador no encontrado.";
        }

        competicion.setAdministrador(adminOpt.get());
        competicionRepository.save(competicion);
        return "Competición creada correctamente.";
    }

    public List<Competicion> listarTodas() {
        return competicionRepository.findAll();
    }
    
    public Competicion obtenerPorId(Long id) {
        return competicionRepository.findById(id).orElse(null);
    }


    public List<Competicion> listarPorAdministrador(Long adminId) {
        return competicionRepository.findByAdministradorId(adminId);
    }
    
    public String añadirParticipante(Long competicionId, Long usuarioId) {
        Optional<Competicion> compOpt = competicionRepository.findById(competicionId);
        Optional<Usuario> userOpt = usuarioRepository.findById(usuarioId);

        if (compOpt.isEmpty() || userOpt.isEmpty()) {
            return "Competición o usuario no encontrado.";
        }

        Competicion competicion = compOpt.get();
        Usuario usuario = userOpt.get();

        if (competicion.getParticipantes().contains(usuario)) {
            return "El usuario ya está inscrito en esta competición.";
        }

        competicion.getParticipantes().add(usuario);
        competicionRepository.save(competicion);

        return "Usuario añadido correctamente a la competición.";
    }
    
    
    public String quitarParticipante(Long competicionId, Long usuarioId) {
        Optional<Competicion> competicionOpt = competicionRepository.findById(competicionId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);

        if (competicionOpt.isEmpty() || usuarioOpt.isEmpty()) {
            return "Usuario o competición no encontrado.";
        }

        Competicion competicion = competicionOpt.get();
        Usuario usuario = usuarioOpt.get();

        if (!competicion.getParticipantes().contains(usuario)) {
            return "El usuario no está en esta competición.";
        }

        competicion.getParticipantes().remove(usuario);
        competicionRepository.save(competicion);

        return "Usuario eliminado correctamente de la competición.";
    }

    

    public List<Usuario> listarParticipantes(Long competicionId) {
        Optional<Competicion> compOpt = competicionRepository.findById(competicionId);
        return compOpt.map(Competicion::getParticipantes).orElse(null);
    }
    
    public boolean eliminarCompeticion(Long id) {
        if (competicionRepository.existsById(id)) {
            competicionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean actualizarConfiguracion(Long id, Competicion nuevosDatos) {
        Optional<Competicion> optComp = competicionRepository.findById(id);
        if (optComp.isEmpty()) return false;

        Competicion comp = optComp.get();
        comp.setPuntosPorResultadoExacto(nuevosDatos.getPuntosPorResultadoExacto());
        comp.setPuntosPorAciertoSimple(nuevosDatos.getPuntosPorAciertoSimple());
        
        competicionRepository.save(comp);
        return true;
    }
    
    public List<Competicion> listarMisCompeticiones(Long usuarioId) {
        return competicionRepository.findAllByParticipantesId(usuarioId);
    }
    
    

}