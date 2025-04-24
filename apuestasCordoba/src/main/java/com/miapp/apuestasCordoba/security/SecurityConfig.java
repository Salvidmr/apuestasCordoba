package com.miapp.apuestasCordoba.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Rutas públicas
                .requestMatchers("/api/usuarios/login", "/api/usuarios/registrar").permitAll()

                // Rutas solo para ADMIN
                .requestMatchers(HttpMethod.POST, "/api/competiciones/crear/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/partidos/crear/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/competiciones/eliminar/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/partidos/editar-fecha/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.DELETE, "/api/partidos/eliminar/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.PUT, "/api/partidos/resultado/**").hasAuthority("admin")
                .requestMatchers("/api/competiciones/participantes/**").hasAuthority("admin")
                .requestMatchers("/api/pronosticos/ver-todos/**").hasAuthority("admin")
                .requestMatchers(HttpMethod.POST, "/api/equipos/crear").hasAuthority("admin")

                // Rutas accesibles para cualquier usuario autenticado (admin o normal)
                .requestMatchers("/api/usuarios/listar").authenticated()
                .requestMatchers("/api/competiciones/mis-competiciones/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/competiciones/**").authenticated()
                .requestMatchers("/api/partidos/competicion/**").authenticated()
                .requestMatchers("/api/apuestas/**").authenticated()
                .requestMatchers("/api/clasificacion/**").authenticated()
                .requestMatchers("/api/anuncios/**").authenticated()
                .requestMatchers("/api/anuncios/competicion/**").authenticated()
                .requestMatchers("/api/equipos/listar").authenticated()

                // Todo lo demás necesita autenticación
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // tu frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
