package com.miapp.apuestasCordoba.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.CompeticionRepository;
import com.miapp.apuestasCordoba.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private CompeticionRepository competicionRepository;

	@PostMapping("/registrar")
	public ResponseEntity<String> registrar(@RequestBody Usuario usuario) {
		String resultado = usuarioService.registrarUsuario(usuario);

		if (resultado.contains("ya está registrado")) {
			return ResponseEntity.badRequest().body(resultado);
		}

		return ResponseEntity.ok(resultado);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
	    Map<String, Object> resultado = usuarioService.loginUsuario(loginRequest);

	    if (resultado.containsKey("error")) {
	        return ResponseEntity.status(401).body(resultado);
	    }

	    return ResponseEntity.ok(resultado);
	}

	@GetMapping("/listar")
	public ResponseEntity<List<Usuario>> listar() {
		return ResponseEntity.ok(usuarioService.listarUsuarios());
	}

//	// Clasificación por competición
//	@GetMapping("/clasificacion/{competicionId}")
//	public ResponseEntity<List<Usuario>> verClasificacion(@PathVariable Long competicionId) {
//		Optional<Competicion> compOpt = competicionRepository.findById(competicionId);
//
//		if (compOpt.isEmpty()) {
//			return ResponseEntity.notFound().build();
//		}
//
//		List<Usuario> clasificacion = compOpt.get().getParticipantes().stream()
//				.sorted(Comparator.comparingInt(Usuario::getPuntos).reversed()).toList();
//
//		return ResponseEntity.ok(clasificacion);
//	}
}