package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Competicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface CompeticionRepository extends JpaRepository<Competicion, Long> {
    List<Competicion> findByAdministradorId(Long adminId, Sort sort);
    List<Competicion> findAllByParticipantesId(Long usuarioId, Sort sort);
}
