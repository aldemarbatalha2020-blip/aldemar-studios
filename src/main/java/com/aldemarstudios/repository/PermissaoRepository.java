package com.aldemarstudios.repository;

import com.aldemarstudios.model.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissaoRepository
        extends JpaRepository<Permissao, Long> {

    Optional<Permissao> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);
}