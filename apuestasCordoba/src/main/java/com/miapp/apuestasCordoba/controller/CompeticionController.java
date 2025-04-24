package com.miapp.apuestasCordoba.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.service.CompeticionService;

@RestController
@RequestMapping("/api/competiciones")
public class CompeticionController {

    @Autowired
    private CompeticionService competicionService;

    // Crear competición
    @PostMapping("/crear/{adminId}")
    public ResponseEntity<String> crearCompeticion(@RequestBody Competicion competicion, @PathVariable Long adminId) {
        String resultado = competicionService.crearCompeticion(competicion, adminId);

        if (resultado.contains("no encontrado")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    // Listar todas las competiciones
    @GetMapping("/todas")
    public List<Competicion> listarTodas() {
        return competicionService.listarTodas();
    }
    
    
    @GetMapping("/{id}")
    public ResponseEntity<Competicion> obtenerCompeticionPorId(@PathVariable Long id) {
        Competicion competicion = competicionService.obtenerPorId(id);
        if (competicion != null) {
            return ResponseEntity.ok(competicion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // Listar competiciones por administrador
    @GetMapping("/admin/{adminId}")
    public List<Competicion> listarPorAdmin(@PathVariable Long adminId) {
        return competicionService.listarPorAdministrador(adminId);
    }
    
    @PostMapping("/{competicionId}/añadir-usuario/{usuarioId}")
    public ResponseEntity<String> añadirUsuario(
            @PathVariable Long competicionId,
            @PathVariable Long usuarioId) {

        String resultado = competicionService.añadirParticipante(competicionId, usuarioId);

        if (resultado.contains("no encontrado") || resultado.contains("ya está")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    
    @DeleteMapping("/{competicionId}/quitar-usuario/{usuarioId}")
    public ResponseEntity<String> quitarUsuarioDeCompeticion(
            @PathVariable Long competicionId,
            @PathVariable Long usuarioId) {

        String resultado = competicionService.quitarParticipante(competicionId, usuarioId);

        if (resultado.contains("no encontrado") || resultado.contains("no está")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }
    
    @GetMapping("/{competicionId}/participantes")
    public ResponseEntity<List<Usuario>> listarParticipantes(@PathVariable Long competicionId) {
        List<Usuario> participantes = competicionService.listarParticipantes(competicionId);

        if (participantes == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(participantes);
    }
    
 // Eliminar una competición por su ID
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarCompeticion(@PathVariable Long id) {
        boolean eliminada = competicionService.eliminarCompeticion(id);

        if (eliminada) {
            return ResponseEntity.ok("Competición eliminada correctamente.");
        } else {
            return ResponseEntity.status(404).body("Competición no encontrada.");
        }
    }

    
 // Obtener la configuración de puntuación de una competición
    @GetMapping("/{competicionId}/puntuacion")
    public ResponseEntity<Competicion> obtenerPuntuacion(@PathVariable Long competicionId) {
        Competicion comp = competicionService.obtenerPorId(competicionId);
        return comp != null ? ResponseEntity.ok(comp) : ResponseEntity.notFound().build();
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<String> actualizarConfiguracion(
            @PathVariable Long id,
            @RequestBody Competicion datosActualizados) {

        boolean actualizado = competicionService.actualizarConfiguracion(id, datosActualizados);
        if (actualizado) {
            return ResponseEntity.ok("Configuración actualizada correctamente.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo actualizar la configuración.");
        }
    }
    
    @GetMapping("/mis-competiciones/{usuarioId}")
    public ResponseEntity<List<Competicion>> listarMisCompeticiones(@PathVariable Long usuarioId) {
        List<Competicion> competiciones = competicionService.listarMisCompeticiones(usuarioId);
        return ResponseEntity.ok(competiciones);
    }

}
