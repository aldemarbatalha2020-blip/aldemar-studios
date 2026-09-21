package com.aldemarstudios.repository;

import com.aldemarstudios.model.Assinatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssinaturaRepository
        extends JpaRepository<Assinatura, Long> {

    List<Assinatura> findByUsuarioIdOrderByInicioDesc(
        Long usuarioId
    );

    Optional<Assinatura> findFirstByUsuarioIdAndStatusIgnoreCaseOrderByExpiraEmDesc(
        Long usuarioId,
        String status
    );
}
