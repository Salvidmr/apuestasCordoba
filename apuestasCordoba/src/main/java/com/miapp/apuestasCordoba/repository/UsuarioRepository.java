package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
    Optional<Usuario> findById(Long id);
}
