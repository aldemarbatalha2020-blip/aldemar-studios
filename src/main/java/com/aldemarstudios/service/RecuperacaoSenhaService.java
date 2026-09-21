package com.aldemarstudios.service;

import com.aldemarstudios.model.PasswordResetToken;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.repository.PasswordResetTokenRepository;
import com.aldemarstudios.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RecuperacaoSenhaService {

    private static final Logger log =
            LoggerFactory.getLogger(RecuperacaoSenhaService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${aldemar.security.password-reset-expiration-minutes:15}")
    private long expiracaoMinutos;

    public RecuperacaoSenhaService(
            UsuarioRepository usuarioRepository,
            PasswordResetTokenRepository tokenRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void solicitarCodigo(String email) {

        log.info("RECUPERACAO: solicitacao recebida.");

        if (email == null || email.isBlank()) {
            log.warn("RECUPERACAO: e-mail vazio ou nulo.");

            throw new IllegalArgumentException(
                    "Informe um e-mail válido."
            );
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        log.info(
                "RECUPERACAO: procurando usuario pelo e-mail informado."
        );

        Optional<Usuario> usuarioOptional =
                usuarioRepository.findByEmail(
                        emailNormalizado
                );

        /*
         * Por segurança, não informamos ao usuário
         * se o e-mail existe ou não.
         */
        if (usuarioOptional.isEmpty()) {

            log.warn(
                    "RECUPERACAO: nenhum usuario encontrado para o e-mail informado."
            );

            return;
        }

        Usuario usuario = usuarioOptional.get();

        log.info(
                "RECUPERACAO: usuario encontrado. ID={}",
                usuario.getId()
        );

        if (!usuario.isAtivo()) {

            log.warn(
                    "RECUPERACAO: usuario encontrado, mas esta inativo. ID={}",
                    usuario.getId()
            );

            return;
        }

        log.info(
                "RECUPERACAO: usuario ativo. Preparando codigo."
        );

        tokenRepository.deleteByUsuario(usuario);

        String codigo =
                String.format(
                        "%06d",
                        secureRandom.nextInt(1_000_000)
                );

        String token =
                UUID.randomUUID()
                        .toString()
                        .replace("-", "");

        LocalDateTime agora =
                LocalDateTime.now();

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setUsuario(usuario);
        resetToken.setCodigo(codigo);
        resetToken.setToken(token);
        resetToken.setCriadoEm(agora);
        resetToken.setExpiraEm(
                agora.plusMinutes(expiracaoMinutos)
        );
        resetToken.setVerificado(false);
        resetToken.setUsado(false);

        tokenRepository.save(resetToken);

        log.info(
                "RECUPERACAO: token salvo no banco. ID={}",
                resetToken.getId()
        );

        enviarEmail(
                usuario,
                codigo
        );

        log.info(
                "RECUPERACAO: processo de envio concluido. Usuario ID={}.",
                usuario.getId()
        );
    }

    @Transactional
    public String verificarCodigo(
            String email,
            String codigo) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "E-mail inválido."
            );
        }

        if (codigo == null ||
                !codigo.matches("\\d{6}")) {

            throw new IllegalArgumentException(
                    "Código inválido."
            );
        }

        String emailNormalizado =
                email.trim().toLowerCase();

        PasswordResetToken resetToken =
                tokenRepository
                        .findByUsuario_EmailAndCodigo(
                                emailNormalizado,
                                codigo
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Código inválido ou expirado."
                                )
                        );

        validarToken(resetToken);

        resetToken.setVerificado(true);

        tokenRepository.save(resetToken);

        return resetToken.getToken();
    }

    @Transactional
    public void redefinirSenha(
            String token,
            String novaSenha) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException(
                    "Token de recuperação inválido."
            );
        }

        if (novaSenha == null ||
                novaSenha.length() < 8) {

            throw new IllegalArgumentException(
                    "A nova senha deve possuir pelo menos 8 caracteres."
            );
        }

        PasswordResetToken resetToken =
                tokenRepository
                        .findByToken(token)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Token de recuperação inválido ou expirado."
                                )
                        );

        validarToken(resetToken);

        if (!resetToken.isVerificado()) {
            throw new IllegalArgumentException(
                    "O código de recuperação ainda não foi confirmado."
            );
        }

        if (resetToken.isUsado()) {
            throw new IllegalArgumentException(
                    "Este token já foi utilizado."
            );
        }

        Usuario usuario =
                resetToken.getUsuario();

        usuario.setSenhaHash(
                passwordEncoder.encode(novaSenha)
        );

        usuario.setSenhaAtualizadaEm(
                LocalDateTime.now()
        );

        usuario.limparTentativasLogin();

        usuario.setBloqueadoAte(null);

        usuarioRepository.save(usuario);

        resetToken.setUsado(true);

        tokenRepository.save(resetToken);
    }

    private void validarToken(
            PasswordResetToken resetToken) {

        if (resetToken.isUsado()) {
            throw new IllegalArgumentException(
                    "Este código já foi utilizado."
            );
        }

        if (resetToken.getExpiraEm()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Código inválido ou expirado."
            );
        }
    }

    private void enviarEmail(
            Usuario usuario,
            String codigo) {

        log.info(
                "RECUPERACAO: iniciando envio de e-mail. Usuario ID={}.",
                usuario.getId()
        );

        SimpleMailMessage mensagem =
                new SimpleMailMessage();

        mensagem.setTo(usuario.getEmail());

        mensagem.setSubject(
                "Aldemar Studios - Código de recuperação de senha"
        );

        mensagem.setText(
                "Olá, " + usuario.getNome() + "!\n\n" +

                "Recebemos uma solicitação para redefinir " +
                "a senha da sua conta no Aldemar Studios.\n\n" +

                "Seu código de recuperação é:\n\n" +

                codigo + "\n\n" +

                "Este código é válido por " +
                expiracaoMinutos +
                " minutos.\n\n" +

                "Se você não solicitou a recuperação de senha, " +
                "ignore este e-mail.\n\n" +

                "Aldemar Studios\n" +
                "Developed by Aldemar Florencio"
        );

        try {

            mailSender.send(mensagem);

            log.info(
                    "RECUPERACAO: JavaMailSender informou envio realizado com sucesso."
            );

        } catch (Exception e) {

            log.error(
                    "RECUPERACAO: ERRO AO ENVIAR E-MAIL: {}",
                    e.getMessage(),
                    e
            );

            throw e;
        }
    }
}
