package com.miapp.apuestasCordoba.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.miapp.apuestasCordoba.model.Usuario;
import com.miapp.apuestasCordoba.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String nombreUsuario = jwtUtil.extractUsername(token);

            if (nombreUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<Usuario> userOpt = usuarioRepository.findByNombreUsuario(nombreUsuario);

                if (userOpt.isPresent() && jwtUtil.validateToken(token)) {
                    Usuario usuario = userOpt.get();          
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol());
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(usuario, null, Collections.singleton(authority));

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        

        filterChain.doFilter(request, response);
    }

}
