package com.miapp.apuestasCordoba.controller;

import com.miapp.apuestasCordoba.model.Anuncio;
import com.miapp.apuestasCordoba.service.AnuncioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    // Crear anuncio (admin)
    @PostMapping("/crear/{competicionId}")
    public ResponseEntity<String> crearAnuncio(@PathVariable Long competicionId, @RequestBody Anuncio anuncio) {
        String resultado = anuncioService.crearAnuncio(anuncio, competicionId);
        return ResponseEntity.ok(resultado);
    }

    // Ver anuncios activos por competición
    @GetMapping("/competicion/{competicionId}")
    public ResponseEntity<List<Anuncio>> verAnunciosActivos(@PathVariable Long competicionId) {
        return ResponseEntity.ok(anuncioService.listarAnunciosActivos(competicionId));
    }
    
    // Editar el anuncio
    @PutMapping("/editar/{anuncioId}")
    public ResponseEntity<String> editarAnuncio(@PathVariable Long anuncioId, @RequestBody Anuncio datos) {
        String resultado = anuncioService.editarAnuncio(anuncioId, datos);
        return ResponseEntity.ok(resultado);
    }
    
    // Eliminar el anuncio por si el admin ya no desea mostrarlo (y así no esperar a la fecha de expiración)
    @DeleteMapping("/eliminar/{anuncioId}")
    public ResponseEntity<String> eliminarAnuncio(@PathVariable Long anuncioId) {
        String resultado = anuncioService.eliminarAnuncio(anuncioId);
        return ResponseEntity.ok(resultado);
    }


}
