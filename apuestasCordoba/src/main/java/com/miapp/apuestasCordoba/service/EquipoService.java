package com.miapp.apuestasCordoba.service;

import com.miapp.apuestasCordoba.model.Equipo;
import com.miapp.apuestasCordoba.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

	@Autowired
	private EquipoRepository equipoRepository;

	public String crearEquipo(Equipo equipo) {
		equipoRepository.save(equipo);
		return "Equipo creado correctamente.";
	}

	public List<Equipo> listarEquipos() {
		return equipoRepository.findAll();
	}
}
