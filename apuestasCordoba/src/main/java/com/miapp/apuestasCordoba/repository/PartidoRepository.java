package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidoRepository extends JpaRepository<Partido, Long> {
	List<Partido> findByCompeticionId(Long competicionId);
}