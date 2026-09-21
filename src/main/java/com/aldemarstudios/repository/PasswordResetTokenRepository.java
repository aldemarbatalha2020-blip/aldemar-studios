package com.aldemarstudios.repository;

import com.aldemarstudios.model.PasswordResetToken;
import com.aldemarstudios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByUsuario_EmailAndCodigo(
            String email,
            String codigo
    );

    Optional<PasswordResetToken> findByToken(
            String token
    );

    void deleteByUsuario(Usuario usuario);
}
