package com.miapp.apuestasCordoba.controller;

import com.miapp.apuestasCordoba.model.Equipo;
import com.miapp.apuestasCordoba.service.EquipoService;
import com.miapp.apuestasCordoba.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

	@Autowired
	private EquipoService equipoService;

	@Autowired
	private EquipoRepository equipoRepository;

	@PostMapping("/crear")
	public ResponseEntity<String> crearEquipo(@RequestBody Equipo equipo) {
		return ResponseEntity.ok(equipoService.crearEquipo(equipo));
	}

	@GetMapping("/listar")
	public ResponseEntity<List<Equipo>> listarEquipos() {
		return ResponseEntity.ok(equipoService.listarEquipos());
	}

	@PutMapping("/editar/{id}")
	public ResponseEntity<String> editarEquipo(@PathVariable Long id, @RequestBody Equipo equipo) {
		Optional<Equipo> equipoOpt = equipoRepository.findById(id);
		if (equipoOpt.isPresent()) {
			Equipo existente = equipoOpt.get();
			existente.setNombre(equipo.getNombre());
			existente.setEscudoUrl(equipo.getEscudoUrl());
			equipoRepository.save(existente);
			return ResponseEntity.ok("Equipo actualizado correctamente.");
		} else {
			return ResponseEntity.status(404).body("Equipo no encontrado.");
		}
	}
}
