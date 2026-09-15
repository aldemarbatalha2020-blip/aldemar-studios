package com.aldemarstudios.security;

import com.aldemarstudios.model.Usuario;
import com.aldemarstudios.repository.UsuarioRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioUserDetailsService
        implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioUserDetailsService(
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        if (email == null || email.isBlank()) {

            throw new UsernameNotFoundException(
                "Usuário não encontrado."
            );
        }

        String emailNormalizado =
            email.trim().toLowerCase();

        Usuario usuario =
            usuarioRepository
                .findByEmail(emailNormalizado)
                .orElseThrow(
                    () -> new UsernameNotFoundException(
                        "Usuário não encontrado."
                    )
                );

        return new UsuarioUserDetails(usuario);
    }
}