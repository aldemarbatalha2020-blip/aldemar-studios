package com.aldemarstudios.controller;

import com.aldemarstudios.dto.CadastroRequest;
import com.aldemarstudios.dto.LoginRequest;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.service.AutenticacaoService;
import com.aldemarstudios.service.CadastroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CadastroService cadastroService;
    private final AutenticacaoService autenticacaoService;

    public AuthController(
            CadastroService cadastroService,
            AutenticacaoService autenticacaoService) {

        this.cadastroService = cadastroService;
        this.autenticacaoService = autenticacaoService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(
            @RequestBody CadastroRequest request) {

        try {

            Usuario usuario =
                    cadastroService.cadastrar(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "status", 201,
                            "mensagem",
                            "Cadastro realizado com sucesso.",
                            "usuario", Map.of(
                                    "id", usuario.getId(),
                                    "nome", usuario.getNome(),
                                    "email", usuario.getEmail(),
                                    "plano", usuario.getPlano().name(),
                                    "tipoConta", usuario.getTipoConta(),
                                    "status", usuario.getStatusConta()
                            )
                    ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", 400,
                            "erro", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "erro",
                            "Nao foi possivel realizar o cadastro."
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            Usuario usuario =
                    autenticacaoService.autenticar(
                            request.email(),
                            request.senha()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "mensagem",
                            "Login realizado com sucesso.",
                            "usuario", Map.of(
                                    "id", usuario.getId(),
                                    "nome", usuario.getNome(),
                                    "email", usuario.getEmail(),
                                    "plano", usuario.getPlano().name(),
                                    "tipoConta", usuario.getTipoConta(),
                                    "status", usuario.getStatusConta()
                            )
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", 401,
                            "erro", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "erro",
                            "Nao foi possivel realizar o login."
                    ));
        }
    }
}
