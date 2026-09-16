package com.aldemarstudios.service;

import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.repository.UsuarioRepository;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final LegacyUsuarioService legacyUsuarioService;
    private final PasswordEncoder argon2Encoder;
    private final BCryptPasswordEncoder bcryptEncoder;

    public AutenticacaoService(
            UsuarioRepository usuarioRepository,
            LegacyUsuarioService legacyUsuarioService,
            PasswordEncoder argon2Encoder) {

        this.usuarioRepository = usuarioRepository;
        this.legacyUsuarioService = legacyUsuarioService;
        this.argon2Encoder = argon2Encoder;
        this.bcryptEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public Usuario autenticar(String email, String senha) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail obrigatório.");
        }

        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("Senha obrigatória.");
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        Optional<Usuario> usuarioExistente =
                usuarioRepository.findByEmail(emailNormalizado);

        /*
         * ============================================================
         * USUÁRIO JÁ MIGRADO / NOVO USUÁRIO
         * ============================================================
         */

        if (usuarioExistente.isPresent()) {

            return autenticarUsuarioNovo(
                    usuarioExistente.get(),
                    senha
            );
        }

        /*
         * ============================================================
         * USUÁRIO LEGADO
         *
         * O banco antigo é consultado somente por SELECT.
         * Nenhuma operação de escrita é executada nele.
         * ============================================================
         */

        Optional<LegacyUsuarioService.LegacyUsuario> legado =
                legacyUsuarioService.buscarPorEmail(
                        emailNormalizado
                );

        if (legado.isEmpty()) {
            throw new IllegalArgumentException(
                    "E-mail ou senha inválidos."
            );
        }

        LegacyUsuarioService.LegacyUsuario usuarioLegado =
                legado.get();

        if (!usuarioLegado.senha().startsWith("$2")) {
            throw new IllegalArgumentException(
                    "E-mail ou senha inválidos."
            );
        }

        boolean senhaValida =
                bcryptEncoder.matches(
                        senha,
                        usuarioLegado.senha()
                );

        if (!senhaValida) {
            throw new IllegalArgumentException(
                    "E-mail ou senha inválidos."
            );
        }

        /*
         * ============================================================
         * MIGRAÇÃO TRANSPARENTE
         *
         * O usuário antigo é copiado para o banco Java.
         * A senha NÃO é copiada como BCrypt.
         * Ela é imediatamente transformada em Argon2id.
         * ============================================================
         */

        Usuario usuario =
                legacyUsuarioService.importarParaBancoNovo(
                        usuarioLegado
                );

        usuario.setSenhaHash(
                argon2Encoder.encode(senha)
        );

        usuario.setSenhaAtualizadaEm(
                LocalDateTime.now()
        );

        usuario.limparTentativasLogin();
        usuario.setUltimoAcesso(
                LocalDateTime.now()
        );

        return usuarioRepository.save(usuario);
    }

    private Usuario autenticarUsuarioNovo(
            Usuario usuario,
            String senha) {

        if (!usuario.isAtivo()) {
            throw new IllegalArgumentException(
                    "Esta conta está inativa."
            );
        }

        if (usuario.estaBloqueado()) {
            throw new IllegalArgumentException(
                    "Esta conta está temporariamente bloqueada."
            );
        }

        String hash = usuario.getSenhaHash();

        boolean senhaValida = false;

        if (hash != null && hash.startsWith("$argon2")) {

            senhaValida =
                    argon2Encoder.matches(
                            senha,
                            hash
                    );

        } else if (hash != null && hash.startsWith("$2")) {

            senhaValida =
                    bcryptEncoder.matches(
                            senha,
                            hash
                    );

            if (senhaValida) {

                usuario.setSenhaHash(
                        argon2Encoder.encode(senha)
                );

                usuario.setSenhaAtualizadaEm(
                        LocalDateTime.now()
                );
            }
        }

        if (!senhaValida) {

            usuario.registrarTentativaFalha();

            if (usuario.getTentativasLogin() >= 5) {

                usuario.setBloqueadoAte(
                        LocalDateTime.now()
                                .plusMinutes(15)
                );

                usuario.incrementarBloqueioQuantidade();
            }

            usuarioRepository.save(usuario);

            throw new IllegalArgumentException(
                    "E-mail ou senha inválidos."
            );
        }

        usuario.limparTentativasLogin();

        usuario.setUltimoAcesso(
                LocalDateTime.now()
        );

        return usuarioRepository.save(usuario);
    }
}
