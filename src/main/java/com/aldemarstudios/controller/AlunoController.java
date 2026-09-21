package com.aldemarstudios.controller;

import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.security.UsuarioUserDetails;
import com.aldemarstudios.service.AcessoPremiumService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/aluno")
public class AlunoController {

    private final AcessoPremiumService acessoPremiumService;

    public AlunoController(
            AcessoPremiumService acessoPremiumService) {

        this.acessoPremiumService = acessoPremiumService;
    }

    @PreAuthorize("hasRole('ALUNO')")
    @GetMapping("/acesso")
    public ResponseEntity<Map<String, Object>> verificarAcesso(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "permitido", false,
                    "erro", "NAO_AUTENTICADO"
                ));
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UsuarioUserDetails userDetails)) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "permitido", false,
                    "erro", "USUARIO_INVALIDO"
                ));
        }

        Usuario usuario = userDetails.getUsuario();

        boolean permitido =
            acessoPremiumService
                .podeAcessarAmbienteAluno(
                    authentication,
                    usuario
                );

        if (!permitido) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                    "permitido", false,
                    "erro", "ASSINATURA_NAO_ATIVA"
                ));
        }

        return ResponseEntity.ok(
            Map.of(
                "permitido", true,
                "usuarioId", usuario.getId(),
                "nome", usuario.getNome(),
                "plano", usuario.getPlano().name()
            )
        );
    }
}
