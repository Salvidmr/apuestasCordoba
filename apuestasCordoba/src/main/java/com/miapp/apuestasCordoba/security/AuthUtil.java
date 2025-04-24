package com.miapp.apuestasCordoba.security;

import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthUtil {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario getUsuarioActual() {
        String nombreUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> userOpt = usuarioRepository.findByNombreUsuario(nombreUsuario);
        return userOpt.orElse(null);
    }
}
