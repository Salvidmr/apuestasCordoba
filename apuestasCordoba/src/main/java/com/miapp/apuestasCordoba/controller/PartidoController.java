package com.miapp.apuestasCordoba.controller;

import com.miapp.apuestasCordoba.model.Partido;
import com.miapp.apuestasCordoba.service.ApuestaService;
import com.miapp.apuestasCordoba.service.PartidoService;
import com.miapp.apuestasCordoba.repository.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

    @Autowired
    private PartidoService partidoService;

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private ApuestaService apuestaService; 

    // Crear partido con equipos reales
    @PostMapping("/crear/{competicionId}/{localId}/{visitanteId}")
    public ResponseEntity<String> crearPartido(
            @RequestBody Partido partido,
            @PathVariable Long competicionId,
            @PathVariable Long localId,
            @PathVariable Long visitanteId) {

        String resultado = partidoService.crearPartido(partido, competicionId, localId, visitanteId);

        if (resultado.contains("no encontrados")) {
            return ResponseEntity.badRequest().body(resultado);
        }

        return ResponseEntity.ok(resultado);
    }

    // Listar partidos de una competición
    @GetMapping("/competicion/{competicionId}")
    public ResponseEntity<List<Partido>> listarPartidos(@PathVariable Long competicionId) {
        return ResponseEntity.ok(partidoService.listarPorCompeticion(competicionId));
    }

    // Eliminar partido
    @DeleteMapping("/eliminar/{partidoId}")
    public ResponseEntity<String> eliminarPartido(@PathVariable Long partidoId) {
        partidoRepository.deleteById(partidoId);
        return ResponseEntity.ok("Partido eliminado correctamente.");
    }

    // Editar fecha del partido
    @PutMapping("/editar-fecha/{partidoId}")
    public ResponseEntity<String> editarFechaPartido(@PathVariable Long partidoId, @RequestBody Partido datos) {
        Optional<Partido> partidoOpt = partidoRepository.findById(partidoId);

        if (partidoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Partido no encontrado.");
        }

        Partido partido = partidoOpt.get();
        partido.setFechaHora(datos.getFechaHora());
        partidoRepository.save(partido);
        return ResponseEntity.ok("Fecha del partido actualizada correctamente.");
    }

    // Asignar resultado real Y calcular puntos automáticamente
    @PutMapping("/resultado/{partidoId}")
    public ResponseEntity<String> asignarResultado(
            @PathVariable Long partidoId,
            @RequestBody Partido datosResultado) {

        Optional<Partido> partidoOpt = partidoRepository.findById(partidoId);

        if (partidoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Partido no encontrado.");
        }

        Partido partido = partidoOpt.get();
        partido.setGolesLocal(datosResultado.getGolesLocal());
        partido.setGolesVisitante(datosResultado.getGolesVisitante());
        partidoRepository.save(partido);

        // Se calculan los partidos solos
        String resultado = apuestaService.calcularPuntos(partidoId);

        return ResponseEntity.ok("Resultado asignado y " + resultado.toLowerCase());
    }
}
