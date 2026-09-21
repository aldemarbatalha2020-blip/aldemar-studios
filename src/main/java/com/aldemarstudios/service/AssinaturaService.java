package com.aldemarstudios.service;

import com.aldemarstudios.model.Assinatura;
import com.aldemarstudios.repository.AssinaturaRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AssinaturaService {

    private final AssinaturaRepository assinaturaRepository;

    public AssinaturaService(
            AssinaturaRepository assinaturaRepository) {

        this.assinaturaRepository = assinaturaRepository;
    }

    public Optional<Assinatura> buscarAssinaturaAtiva(
            Long usuarioId) {

        if (usuarioId == null) {
            return Optional.empty();
        }

        return assinaturaRepository
            .findFirstByUsuarioIdAndStatusIgnoreCaseOrderByExpiraEmDesc(
                usuarioId,
                "ativa"
            )
            .filter(Assinatura::estaAtiva);
    }

    public boolean possuiAssinaturaAtiva(
            Long usuarioId) {

        return buscarAssinaturaAtiva(usuarioId).isPresent();
    }

    public boolean possuiPlano(
            Long usuarioId,
            String plano) {

        if (plano == null || plano.isBlank()) {
            return false;
        }

        return buscarAssinaturaAtiva(usuarioId)
            .map(Assinatura::getPlano)
            .map(planoAtivo ->
                planoAtivo.equalsIgnoreCase(plano)
            )
            .orElse(false);
    }
}
