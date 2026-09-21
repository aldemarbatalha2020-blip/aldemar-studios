package com.aldemarstudios.controller;

import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.security.UsuarioUserDetails;
import com.aldemarstudios.service.AcessoPremiumService;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/aluno/conteudo")
public class ConteudoPremiumController {

    private final AcessoPremiumService acessoPremiumService;

    public ConteudoPremiumController(
            AcessoPremiumService acessoPremiumService) {
        this.acessoPremiumService = acessoPremiumService;
    }

    @PreAuthorize("hasRole('ALUNO')")
    @GetMapping("/{arquivo:.+}")
    public ResponseEntity<Resource> acessarConteudo(
            @PathVariable String arquivo,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UsuarioUserDetails userDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = userDetails.getUsuario();

        if (!acessoPremiumService.podeAcessarAmbienteAluno(
                authentication, usuario)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!arquivo.matches("[a-zA-Z0-9._-]+")) {
            return ResponseEntity.badRequest().build();
        }

        Resource recurso =
                new ClassPathResource("premium/" + arquivo);

        if (!recurso.exists() || !recurso.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String nome = arquivo.toLowerCase();

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        if (nome.endsWith(".pdf")) {
            mediaType = MediaType.APPLICATION_PDF;
        } else if (nome.endsWith(".mp4")) {
            mediaType = MediaType.valueOf("video/mp4");
        } else if (nome.endsWith(".webm")) {
            mediaType = MediaType.valueOf("video/webm");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(arquivo)
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(recurso);
    }
}