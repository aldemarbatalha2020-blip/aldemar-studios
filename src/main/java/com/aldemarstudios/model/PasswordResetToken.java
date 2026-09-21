package com.aldemarstudios.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "password_reset_tokens",
    indexes = {
        @Index(name = "idx_password_reset_usuario", columnList = "usuario_id"),
        @Index(name = "idx_password_reset_codigo", columnList = "codigo"),
        @Index(name = "idx_password_reset_expira", columnList = "expira_em")
    }
)
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "usuario_id",
        nullable = false
    )
    private Usuario usuario;

    @Column(
        name = "codigo",
        nullable = false,
        length = 6
    )
    private String codigo;

    @Column(
        name = "token",
        nullable = false,
        unique = true,
        length = 100
    )
    private String token;

    @Column(
        name = "criado_em",
        nullable = false
    )
    private LocalDateTime criadoEm;

    @Column(
        name = "expira_em",
        nullable = false
    )
    private LocalDateTime expiraEm;

    @Column(
        name = "verificado",
        nullable = false
    )
    private boolean verificado = false;

    @Column(
        name = "usado",
        nullable = false
    )
    private boolean usado = false;

    @PrePersist
    protected void antesDePersistir() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }

    public boolean isVerificado() {
        return verificado;
    }

    public void setVerificado(boolean verificado) {
        this.verificado = verificado;
    }

    public boolean isUsado() {
        return usado;
    }

    public void setUsado(boolean usado) {
        this.usado = usado;
    }
}
