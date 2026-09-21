package com.aldemarstudios.controller;

import com.aldemarstudios.dto.CadastroRequest;
import com.aldemarstudios.dto.LoginRequest;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.service.AutenticacaoService;
import com.aldemarstudios.service.CadastroService;
import com.aldemarstudios.service.RecuperacaoSenhaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CadastroService cadastroService;
    private final AutenticacaoService autenticacaoService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public AuthController(
            CadastroService cadastroService,
            AutenticacaoService autenticacaoService,
            RecuperacaoSenhaService recuperacaoSenhaService) {

        this.cadastroService = cadastroService;
        this.autenticacaoService = autenticacaoService;
        this.recuperacaoSenhaService = recuperacaoSenhaService;
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

    // ============================================================
    // RECUPERAÇÃO DE SENHA
    // ============================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");

            recuperacaoSenhaService.solicitarCodigo(email);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message",
                            "Código enviado com sucesso."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", 400,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "message",
                            "Não foi possível enviar o código de recuperação."
                    ));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(
            @RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");
            String codigo = request.get("codigo");

            String token =
                    recuperacaoSenhaService.verificarCodigo(
                            email,
                            codigo
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message",
                            "Código confirmado com sucesso.",
                            "token", token
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", 400,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "message",
                            "Não foi possível verificar o código."
                    ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        try {

            String token = request.get("token");
            String novaSenha = request.get("nova_senha");

            recuperacaoSenhaService.redefinirSenha(
                    token,
                    novaSenha
            );

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message",
                            "Senha redefinida com sucesso."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", 400,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "message",
                            "Não foi possível redefinir a senha."
                    ));
        }
    }
}