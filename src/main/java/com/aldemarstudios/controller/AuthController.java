package com.aldemarstudios.controller;

import com.aldemarstudios.dto.CadastroRequest;
import com.aldemarstudios.dto.LoginRequest;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.security.UsuarioUserDetails;
import com.aldemarstudios.service.AutenticacaoService;
import com.aldemarstudios.service.CadastroService;
import com.aldemarstudios.service.RecuperacaoSenhaService;
import com.aldemarstudios.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    private final CadastroService cadastroService;
    private final AutenticacaoService autenticacaoService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public AuthController(
            CadastroService cadastroService,
            AutenticacaoService autenticacaoService,
            RecuperacaoSenhaService recuperacaoSenhaService,
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
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
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        try {

            Usuario usuario =
                    autenticacaoService.autenticar(
                            request.email(),
                            request.senha()
                    );

            UsuarioUserDetails userDetails =
                    new UsuarioUserDetails(usuario);

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContext securityContext =
                    SecurityContextHolder.createEmptyContext();

            securityContext.setAuthentication(authentication);

            SecurityContextHolder.setContext(securityContext);

            httpRequest
                    .getSession(true)
                    .setAttribute(
                            HttpSessionSecurityContextRepository
                                    .SPRING_SECURITY_CONTEXT_KEY,
                            securityContext
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "mensagem",
                            "Login realizado com sucesso.",
                            "usuario",
                            montarDadosUsuario(usuario)
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

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<?> atualizarPerfil(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        try {

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "status", 401,
                                "erro", "NAO_AUTENTICADO"
                        ));
            }

            Object principal =
                    authentication.getPrincipal();

            if (!(principal instanceof UsuarioUserDetails userDetails)) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "status", 401,
                                "erro", "USUARIO_INVALIDO"
                        ));
            }

            Usuario usuario =
                    userDetails.getUsuario();

            if (request.containsKey("nome")) {

                String nome =
                        request.get("nome") == null
                                ? ""
                                : request.get("nome").toString().trim();

                if (nome.isBlank()) {

                    return ResponseEntity
                            .badRequest()
                            .body(Map.of(
                                    "status", 400,
                                    "erro", "Nome obrigatorio."
                            ));
                }

                usuario.setNome(nome);
            }

            if (request.containsKey("nick")) {

                Object nickValue =
                        request.get("nick");

                usuario.setNick(
                        nickValue == null
                                ? null
                                : nickValue.toString().trim()
                );
            }

            if (request.containsKey("email")) {

                String email =
                        request.get("email") == null
                                ? ""
                                : request.get("email").toString().trim().toLowerCase();

                if (email.isBlank()) {

                    return ResponseEntity
                            .badRequest()
                            .body(Map.of(
                                    "status", 400,
                                    "erro", "E-mail obrigatorio."
                            ));
                }

                usuario.setEmail(email);
            }

            if (request.containsKey("foto")) {

                Object fotoValue =
                        request.get("foto");

                usuario.setFoto(
                        fotoValue == null
                                ? null
                                : fotoValue.toString()
                );
            }

            usuarioRepository.save(usuario);

return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "mensagem",
                            "Perfil atualizado com sucesso.",
                            "user",
                            montarDadosUsuario(usuario)
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", 500,
                            "erro",
                            "Nao foi possivel atualizar o perfil."
                    ));
        }
    }

    private Map<String, Object> montarDadosUsuario(
            Usuario usuario) {

        Map<String, Object> dados =
                new LinkedHashMap<>();

        dados.put(
                "id",
                usuario.getId()
        );

        dados.put(
                "nome",
                usuario.getNome()
        );

        dados.put(
                "nick",
                usuario.getNick()
        );

        dados.put(
                "email",
                usuario.getEmail()
        );

        dados.put(
                "foto",
                usuario.getFoto()
        );

        dados.put(
                "plano",
                usuario.getPlano().name()
        );

        dados.put(
                "tipoConta",
                usuario.getTipoConta()
        );

        dados.put(
                "status",
                usuario.getStatusConta()
        );

        return dados;
    }

    // ============================================================
    // RECUPERACAO DE SENHA
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
                            "Codigo enviado com sucesso."
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
                            "Nao foi possivel enviar o codigo de recuperacao."
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
                            "Codigo confirmado com sucesso.",
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
                            "Nao foi possivel verificar o codigo."
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
                            "Nao foi possivel redefinir a senha."
                    ));
        }
    }
}