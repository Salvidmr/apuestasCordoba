package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Apuesta;
import com.miapp.apuestasCordoba.model.Partido;
import com.miapp.apuestasCordoba.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ApuestaRepository extends JpaRepository<Apuesta, Long> {

    Optional<Apuesta> findByUsuarioAndPartido(Usuario usuario, Partido partido);

    List<Apuesta> findByUsuarioId(Long usuarioId);

    List<Apuesta> findByPartidoId(Long partidoId);

    List<Apuesta> findByUsuarioIdAndPartidoCompeticionId(Long usuarioId, Long competicionId);

    // ✅ NUEVO: obtener todas las apuestas de una competición
    List<Apuesta> findByPartido_Competicion_Id(Long competicionId);
}
