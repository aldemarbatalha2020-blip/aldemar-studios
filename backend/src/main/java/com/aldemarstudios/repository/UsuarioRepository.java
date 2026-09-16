package com.aldemarstudios.repository;

import com.aldemarstudios.model.Usuario;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    @EntityGraph(
        attributePaths = {
            "roles",
            "roles.permissoes"
        }
    )
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
}