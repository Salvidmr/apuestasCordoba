package com.miapp.apuestasCordoba.service;

import com.miapp.apuestasCordoba.model.Anuncio;
import com.miapp.apuestasCordoba.model.Competicion;
import com.miapp.apuestasCordoba.repository.AnuncioRepository;
import com.miapp.apuestasCordoba.repository.CompeticionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnuncioService {

	@Autowired
	private AnuncioRepository anuncioRepository;

	@Autowired
	private CompeticionRepository competicionRepository;

	public String crearAnuncio(Anuncio anuncio, Long competicionId) {
		Optional<Competicion> compOpt = competicionRepository.findById(competicionId);
		if (compOpt.isEmpty()) {
			return "Competición no encontrada.";
		}

		anuncio.setCompeticion(compOpt.get());
		anuncio.setFechaPublicacion(LocalDateTime.now());
		anuncioRepository.save(anuncio);
		return "Anuncio publicado correctamente.";
	}

	public List<Anuncio> listarAnunciosActivos(Long competicionId) {
		return anuncioRepository.findByCompeticionIdAndFechaExpiracionAfter(competicionId, LocalDateTime.now());
	}

	public String editarAnuncio(Long anuncioId, Anuncio nuevosDatos) {
		Optional<Anuncio> anuncioOpt = anuncioRepository.findById(anuncioId);

		if (anuncioOpt.isEmpty()) {
			return "Anuncio no encontrado.";
		}

		Anuncio anuncio = anuncioOpt.get();
		anuncio.setTitulo(nuevosDatos.getTitulo());
		anuncio.setContenido(nuevosDatos.getContenido());
		anuncio.setFechaExpiracion(nuevosDatos.getFechaExpiracion());

		anuncioRepository.save(anuncio);
		return "Anuncio actualizado correctamente.";
	}

	public String eliminarAnuncio(Long anuncioId) {
		if (!anuncioRepository.existsById(anuncioId)) {
			return "Anuncio no encontrado.";
		}

		anuncioRepository.deleteById(anuncioId);
		return "Anuncio eliminado correctamente.";
	}

}
