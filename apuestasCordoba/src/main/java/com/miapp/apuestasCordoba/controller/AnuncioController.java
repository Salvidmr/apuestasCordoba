package com.miapp.apuestasCordoba.controller;

import com.miapp.apuestasCordoba.model.Anuncio;
import com.miapp.apuestasCordoba.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//Controlador que se encarga de gestionar todo lo relacionado con los anuncios
@RestController
@RequestMapping("/api/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    // Endpoint que permite al usuario crear un anuncio en una competición específica
    @PostMapping("/crear/{competicionId}")
    public ResponseEntity<String> crearAnuncio(@PathVariable Long competicionId, @RequestBody Anuncio anuncio) {
        String resultado = anuncioService.crearAnuncio(anuncio, competicionId);
        return ResponseEntity.ok(resultado);
    }

    // Endpoint que permite listar todos los anuncios que están activos (es decir, no expirados)
    @GetMapping("/competicion/{competicionId}")
    public ResponseEntity<List<Anuncio>> verAnunciosActivos(@PathVariable Long competicionId) {
        return ResponseEntity.ok(anuncioService.listarAnunciosActivos(competicionId));
    }
    
    // Endpoint para permitir que el admin pueda editar su contenido
    @PutMapping("/editar/{anuncioId}")
    public ResponseEntity<String> editarAnuncio(@PathVariable Long anuncioId, @RequestBody Anuncio datos) {
        String resultado = anuncioService.editarAnuncio(anuncioId, datos);
        return ResponseEntity.ok(resultado);
    }
    
    // Endpoint que permite al admin eliminar un anuncio sin tener que esperar a que expire
    @DeleteMapping("/eliminar/{anuncioId}")
    public ResponseEntity<String> eliminarAnuncio(@PathVariable Long anuncioId) {
        String resultado = anuncioService.eliminarAnuncio(anuncioId);
        return ResponseEntity.ok(resultado);
    }


}
