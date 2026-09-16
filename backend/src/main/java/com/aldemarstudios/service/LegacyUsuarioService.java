package com.aldemarstudios.service;

import com.aldemarstudios.model.Plano;
import com.aldemarstudios.model.Role;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.repository.RoleRepository;
import com.aldemarstudios.repository.UsuarioRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

@Service
public class LegacyUsuarioService {

    private final JdbcTemplate legacyJdbcTemplate;
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;

    public LegacyUsuarioService(
            JdbcTemplate legacyJdbcTemplate,
            UsuarioRepository usuarioRepository,
            RoleRepository roleRepository) {

        this.legacyJdbcTemplate = legacyJdbcTemplate;
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
    }

    public Optional<LegacyUsuario> buscarPorEmail(String email) {

        String sql = """
                SELECT
                    id,
                    nome_completo,
                    nick,
                    email,
                    foto,
                    senha,
                    plano,
                    status,
                    tipo_conta,
                    criado_em
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                """;

        return legacyJdbcTemplate.query(
                sql,
                rs -> {
                    if (!rs.next()) {
                        return Optional.empty();
                    }

                    Timestamp criadoEm = rs.getTimestamp("criado_em");

                    return Optional.of(
                            new LegacyUsuario(
                                    rs.getLong("id"),
                                    rs.getString("nome_completo"),
                                    rs.getString("nick"),
                                    rs.getString("email"),
                                    rs.getString("foto"),
                                    rs.getString("senha"),
                                    rs.getString("plano"),
                                    rs.getString("status"),
                                    rs.getString("tipo_conta"),
                                    criadoEm != null
                                            ? criadoEm.toLocalDateTime()
                                            : null
                            )
                    );
                },
                email.trim().toLowerCase()
        );
    }

    @Transactional
    public Usuario importarParaBancoNovo(
            LegacyUsuario legado) {

        String email = legado.email()
                .trim()
                .toLowerCase();

        Optional<Usuario> existente =
                usuarioRepository.findByEmail(email);

        if (existente.isPresent()) {
            return existente.get();
        }

        Usuario usuario = new Usuario();

        usuario.setNome(
                legado.nomeCompleto() != null
                        ? legado.nomeCompleto().trim()
                        : "Usuário"
        );

        usuario.setEmail(email);
        usuario.setNick(legado.nick());
        usuario.setFoto(legado.foto());

        usuario.setSenhaHash(legado.senha());

        usuario.setAtivo(
                "ativo".equalsIgnoreCase(legado.status())
        );

        usuario.setEmailVerificado(true);

        if (legado.criadoEm() != null) {
            usuario.setDataCadastro(legado.criadoEm());
        }

        try {
            usuario.setPlano(
                    Plano.valueOf(
                            legado.plano().toUpperCase(Locale.ROOT)
                    )
            );
        } catch (Exception e) {
            usuario.setPlano(Plano.GRATUITO);
        }

        if ("admin".equalsIgnoreCase(legado.tipoConta())) {
            usuario.setTipoConta("ADMIN");
            usuario.setStatusConta(
                    "ativo".equalsIgnoreCase(legado.status())
                            ? "ATIVO"
                            : "INATIVO"
            );
        } else {
            usuario.setTipoConta("USUARIO");
            usuario.setStatusConta(
                    "ativo".equalsIgnoreCase(legado.status())
                            ? "ATIVO"
                            : "INATIVO"
            );
        }

        Role.NomeRole nomeRole =
                "admin".equalsIgnoreCase(legado.tipoConta())
                        ? Role.NomeRole.ADMIN
                        : Role.NomeRole.ALUNO;

        Role role = roleRepository
                .findByNome(nomeRole)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Role " + nomeRole +
                                " não encontrada."
                        )
                );

        usuario.adicionarRole(role);

        return usuarioRepository.save(usuario);
    }

    public record LegacyUsuario(
            Long id,
            String nomeCompleto,
            String nick,
            String email,
            String foto,
            String senha,
            String plano,
            String status,
            String tipoConta,
            LocalDateTime criadoEm
    ) {
    }
}
