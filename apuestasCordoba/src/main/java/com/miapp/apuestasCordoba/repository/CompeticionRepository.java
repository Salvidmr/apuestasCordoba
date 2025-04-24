package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Competicion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompeticionRepository extends JpaRepository<Competicion, Long> {
    List<Competicion> findByAdministradorId(Long adminId);
    List<Competicion> findAllByParticipantesId(Long usuarioId);
}
