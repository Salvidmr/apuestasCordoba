package com.miapp.apuestasCordoba.repository;

import com.miapp.apuestasCordoba.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
	
}
