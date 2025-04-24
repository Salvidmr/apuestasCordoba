package com.miapp.apuestasCordoba.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.miapp.apuestasCordoba.model.Apuesta;
import com.miapp.apuestasCordoba.service.ApuestaService;

@RestController
@RequestMapping("/api/apuestas")
public class ApuestaController {

    @Autowired
    private ApuestaService apuestaService;

    @PostMapping("/realizar/{usuarioId}/{partidoId}")
    public ResponseEntity<String> realizarOActualizarApuesta(@RequestBody Apuesta apuesta, @PathVariable Long usuarioId,
                                                             @PathVariable Long partidoId) {
        String resultado = apuestaService.realizarOActualizarApuesta(apuesta, usuarioId, partidoId);

        if (!resultado.contains("correctamente")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/modificar/{usuarioId}/{partidoId}")
    public ResponseEntity<String> modificarApuesta(@PathVariable Long usuarioId, @PathVariable Long partidoId,
                                                   @RequestBody Apuesta apuesta) {
        String resultado = apuestaService.modificarApuesta(usuarioId, partidoId, apuesta);

        if (!resultado.equals("Apuesta modificada correctamente.")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<List<Apuesta>> listarApuestasPorPartido(@PathVariable Long partidoId) {
        List<Apuesta> apuestas = apuestaService.listarApuestasPorPartido(partidoId);
        return ResponseEntity.ok(apuestas);
    }

    @GetMapping("/usuario/{usuarioId}/competicion/{competicionId}")
    public ResponseEntity<List<Apuesta>> getApuestasUsuarioEnCompeticion(@PathVariable Long usuarioId,
                                                                          @PathVariable Long competicionId) {
        List<Apuesta> apuestas = apuestaService.getApuestasDeUsuarioPorCompeticion(usuarioId, competicionId);
        return ResponseEntity.ok(apuestas);
    }

    // ✅ NUEVO: Clasificación por competición
    @GetMapping("/clasificacion/{competicionId}")
    public ResponseEntity<List<Map<String, Object>>> getClasificacionPorCompeticion(@PathVariable Long competicionId) {
        List<Map<String, Object>> clasificacion = apuestaService.obtenerClasificacionPorCompeticion(competicionId);
        return ResponseEntity.ok(clasificacion);
    }
}
