package com.miapp.apuestasCordoba.controller;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.security.PasswordEncoderUtil;
import com.miapp.apuestasCordoba.service.EmailService;
import com.miapp.apuestasCordoba.service.UsuarioService;

// Controlador que gestiona los usuarios
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private EmailService emailService;

	// Endpoint que permite a una persona registrarse
	@PostMapping("/registrar")
	public ResponseEntity<String> registrar(@RequestBody Usuario usuario) {
		String resultado = usuarioService.registrarUsuario(usuario);

		if (resultado.contains("ya está registrado")) {
			return ResponseEntity.badRequest().body(resultado);
		}

		return ResponseEntity.ok(resultado);
	}

	// Endpoint que permite loguearse a un usuario
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		Map<String, Object> resultado = usuarioService.loginUsuario(loginRequest);

		if (resultado.containsKey("error")) {
			return ResponseEntity.status(401).body(resultado);
		}

		return ResponseEntity.ok(resultado);
	}

	// Endpoint que permite obtener todos los usuarios
	@GetMapping("/listar")
	public ResponseEntity<List<Usuario>> listar() {
		return ResponseEntity.ok(usuarioService.listarUsuarios());
	}

	// Endpoint que permite obtener un usuario por su id
	@GetMapping("/{id}")
	public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
		Optional<Usuario> usuario = usuarioService.findById(id);
		return usuario.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// Endpoint que permite actualizar un usuario
	@PutMapping("/{id}")
	public ResponseEntity<String> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
		boolean ok = usuarioService.actualizarUsuario(id, datosActualizados);
		return ok
				? ResponseEntity.ok("Usuario actualizado correctamente.")
				: ResponseEntity.badRequest().body("No se pudo actualizar el usuario.");
	}

	// Endpoint que permite recuperar la contraseña en caso de perderla (se recupera con un PIN)
	@PutMapping("/recuperar-password/{nombreUsuario}")
	public ResponseEntity<String> recuperarPassword(
			@PathVariable String nombreUsuario,
			@RequestBody Map<String, String> body) {

		Optional<Usuario> usuarioOpt = usuarioService.findByNombreUsuario(nombreUsuario);

		if (usuarioOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Usuario no encontrado.");
		}

		Usuario usuario = usuarioOpt.get();

		String email = body.get("email");
		String pin = body.get("pin");
		String nuevaPassword = body.get("password");

		if (email == null || pin == null || nuevaPassword == null ||
				email.isBlank() || pin.isBlank() || nuevaPassword.isBlank()) {
			return ResponseEntity.badRequest().body("Faltan datos requeridos.");
		}

		if (!usuario.getEmail().equalsIgnoreCase(email) || !usuario.getPin().equals(pin)) {
			return ResponseEntity.status(403).body("Datos de verificación incorrectos.");
		}

		usuario.setPassword(PasswordEncoderUtil.encode(nuevaPassword));
		usuarioService.guardar(usuario);

		return ResponseEntity.ok("Contraseña actualizada correctamente.");
	}

	@PostMapping("/enviar-pin/{id}")
	public ResponseEntity<String> enviarPin(@PathVariable Long id) {
		Optional<Usuario> usuarioOpt = usuarioService.findById(id);

		if (usuarioOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Usuario no encontrado.");
		}

		Usuario usuario = usuarioOpt.get();

		emailService.enviarPin(usuario.getEmail(), usuario.getNombreUsuario(), usuario.getPin());

		return ResponseEntity.ok("PIN enviado al correo.");
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> eliminarUsuario(@PathVariable Long id) {
		boolean eliminado = usuarioService.eliminarUsuarioPorId(id);
		if (eliminado) {
			return ResponseEntity.ok("Usuario eliminado correctamente.");
		} else {
			return ResponseEntity.badRequest().body("No se pudo eliminar el usuario.");
		}
	}
}