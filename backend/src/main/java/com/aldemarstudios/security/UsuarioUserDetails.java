package com.aldemarstudios.security;

import com.aldemarstudios.model.Permissao;
import com.aldemarstudios.model.Role;
import com.aldemarstudios.model.Usuario;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UsuarioUserDetails implements UserDetails {

    private final Usuario usuario;

    public UsuarioUserDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        List<GrantedAuthority> authorities = new ArrayList<>();

        for (Role role : usuario.getRoles()) {

            authorities.add(
                new SimpleGrantedAuthority(
                    "ROLE_" + role.getNome().name()
                )
            );

            for (Permissao permissao : role.getPermissoes()) {

                authorities.add(
                    new SimpleGrantedAuthority(
                        permissao.getCodigo()
                    )
                );
            }
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHash();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !usuario.estaBloqueado();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return usuario.isAtivo();
    }
}