package com.aldemarstudios.service;

import com.aldemarstudios.model.Assinatura;
import com.aldemarstudios.model.Plano;
import com.aldemarstudios.model.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AcessoPremiumService {

    private final AssinaturaService assinaturaService;

    public AcessoPremiumService(
            AssinaturaService assinaturaService) {

        this.assinaturaService = assinaturaService;
    }

    public boolean podeAcessarAmbienteAluno(
            Authentication authentication,
            Usuario usuario) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || usuario == null) {

            return false;
        }

        if (!usuario.isAtivo()
                || usuario.estaBloqueado()) {

            return false;
        }

        Optional<Assinatura> assinatura =
            assinaturaService.buscarAssinaturaAtiva(
                usuario.getId()
            );

        if (assinatura.isEmpty()) {
            return false;
        }

        String plano = assinatura
            .get()
            .getPlano();

        return plano != null
            && !plano.equalsIgnoreCase(
                Plano.GRATUITO.name()
            );
    }
}
