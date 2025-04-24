package com.miapp.apuestasCordoba.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.miapp.apuestasCordoba.controller.LoginRequest;
import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.UsuarioRepository;
import com.miapp.apuestasCordoba.security.JwtUtil;
import com.miapp.apuestasCordoba.security.PasswordEncoderUtil;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()
                || usuarioRepository.findByNombreUsuario(usuario.getNombreUsuario()).isPresent()) {
            return "El email o nombre de usuario ya está registrado.";
        }

        // Forzar que el rol sea siempre "user"
        usuario.setRol("user");

        String passCifrada = PasswordEncoderUtil.encode(usuario.getPassword());
        usuario.setPassword(passCifrada);
        usuarioRepository.save(usuario);

        return "Usuario registrado correctamente.";
    }

    public Map<String, Object> loginUsuario(LoginRequest loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(loginRequest.getNombreUsuario());

        Map<String, Object> response = new HashMap<>();

        if (usuarioOpt.isEmpty()) {
            response.put("error", "Usuario no encontrado.");
            return response;
        }

        Usuario usuario = usuarioOpt.get();

        if (!PasswordEncoderUtil.matches(loginRequest.getPassword(), usuario.getPassword())) {
            response.put("error", "Contraseña incorrecta.");
            return response;
        }

        String token = jwtUtil.generateToken(usuario.getNombreUsuario());

        response.put("token", token);
        response.put("rol", usuario.getRol());
        response.put("id", usuario.getId());
        response.put("nombreUsuario", usuario.getNombreUsuario());

        return response;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
