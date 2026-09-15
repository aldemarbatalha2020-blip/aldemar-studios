package com.aldemarstudios.service;

import com.aldemarstudios.dto.CadastroRequest;
import com.aldemarstudios.model.Role;
import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.repository.RoleRepository;
import com.aldemarstudios.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CadastroService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public CadastroService(
            UsuarioRepository usuarioRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario cadastrar(CadastroRequest request) {

        String nome = request.nome().trim();

        String email = request.email()
                .trim()
                .toLowerCase();

        if (!request.senha().equals(request.confirmacaoSenha())) {
            throw new IllegalArgumentException(
                    "As senhas não coincidem."
            );
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Este e-mail já está cadastrado."
            );
        }

        Role roleAluno = roleRepository
                .findByNome(Role.NomeRole.ALUNO)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "A função ALUNO não foi encontrada no banco de dados."
                        )
                );

        Usuario usuario = new Usuario();

        usuario.setNome(nome);
        usuario.setEmail(email);

        usuario.setSenhaHash(
                passwordEncoder.encode(request.senha())
        );

        usuario.setAtivo(true);
        usuario.setEmailVerificado(false);

        usuario.adicionarRole(roleAluno);

        return usuarioRepository.save(usuario);
    }
}