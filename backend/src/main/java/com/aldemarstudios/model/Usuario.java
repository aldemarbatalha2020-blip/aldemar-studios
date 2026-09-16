package com.aldemarstudios.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
    name = "usuarios",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_usuarios_email",
            columnNames = "email"
        )
    }
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "nome",
        nullable = false,
        length = 150
    )
    private String nome;

    @Column(
        name = "nick",
        length = 30
    )
    private String nick;

    @Column(
        name = "email",
        nullable = false,
        unique = true,
        length = 255
    )
    private String email;

    @Column(
        name = "foto",
        columnDefinition = "LONGTEXT"
    )
    private String foto;

    @Column(
        name = "senha_hash",
        nullable = false,
        length = 255
    )
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "plano",
        nullable = false,
        length = 20
    )
    private Plano plano = Plano.GRATUITO;

    @Column(
        name = "tipo_conta",
        nullable = false,
        length = 20
    )
    private String tipoConta = "USUARIO";

    @Column(
        name = "status_conta",
        nullable = false,
        length = 20
    )
    private String statusConta = "ATIVO";

    @Column(
        name = "ativo",
        nullable = false
    )
    private boolean ativo = true;

    @Column(
        name = "email_verificado",
        nullable = false
    )
    private boolean emailVerificado = false;

    @Column(
        name = "tentativas_login",
        nullable = false
    )
    private int tentativasLogin = 0;

    @Column(
        name = "ultima_tentativa_login"
    )
    private LocalDateTime ultimaTentativaLogin;

    @Column(
        name = "bloqueio_quantidade",
        nullable = false
    )
    private int bloqueioQuantidade = 0;

    @Column(
        name = "bloqueado_ate"
    )
    private LocalDateTime bloqueadoAte;

    @Column(
        name = "senha_atualizada_em"
    )
    private LocalDateTime senhaAtualizadaEm;

    @Column(
        name = "data_cadastro",
        nullable = false
    )
    private LocalDateTime dataCadastro;

    @Column(
        name = "ultimo_acesso"
    )
    private LocalDateTime ultimoAcesso;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @PrePersist
    protected void antesDePersistir() {

        normalizarEmail();

        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }

        if (senhaAtualizadaEm == null) {
            senhaAtualizadaEm = LocalDateTime.now();
        }

        if (plano == null) {
            plano = Plano.GRATUITO;
        }

        if (tipoConta == null || tipoConta.isBlank()) {
            tipoConta = "USUARIO";
        }

        if (statusConta == null || statusConta.isBlank()) {
            statusConta = "ATIVO";
        }
    }

    @PreUpdate
    protected void antesDeAtualizar() {
        normalizarEmail();
    }

    private void normalizarEmail() {

        if (email != null) {
            email = email
                .trim()
                .toLowerCase();
        }
    }

    public boolean estaBloqueado() {

        if ("BLOQUEADO".equalsIgnoreCase(statusConta)) {
            return true;
        }

        return bloqueadoAte != null
            && bloqueadoAte.isAfter(LocalDateTime.now());
    }

    public void registrarTentativaFalha() {

        tentativasLogin++;
        ultimaTentativaLogin = LocalDateTime.now();
    }

    public void limparTentativasLogin() {

        tentativasLogin = 0;
        bloqueadoAte = null;
        ultimaTentativaLogin = null;
    }

    public void adicionarRole(Role role) {
        roles.add(role);
    }

    public void removerRole(Role role) {
        roles.remove(role);
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public Plano getPlano() {
        return plano;
    }

    public void setPlano(Plano plano) {
        this.plano = plano;
    }

    public String getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta;
    }

    public String getStatusConta() {
        return statusConta;
    }

    public void setStatusConta(String statusConta) {
        this.statusConta = statusConta;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public boolean isEmailVerificado() {
        return emailVerificado;
    }

    public void setEmailVerificado(boolean emailVerificado) {
        this.emailVerificado = emailVerificado;
    }

    public int getTentativasLogin() {
        return tentativasLogin;
    }

    public LocalDateTime getUltimaTentativaLogin() {
        return ultimaTentativaLogin;
    }

    public int getBloqueioQuantidade() {
        return bloqueioQuantidade;
    }

    public void incrementarBloqueioQuantidade() {
        bloqueioQuantidade++;
    }

    public LocalDateTime getBloqueadoAte() {
        return bloqueadoAte;
    }

    public void setBloqueadoAte(LocalDateTime bloqueadoAte) {
        this.bloqueadoAte = bloqueadoAte;
    }

    public LocalDateTime getSenhaAtualizadaEm() {
        return senhaAtualizadaEm;
    }

    public void setSenhaAtualizadaEm(
            LocalDateTime senhaAtualizadaEm) {

        this.senhaAtualizadaEm = senhaAtualizadaEm;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public LocalDateTime getUltimoAcesso() {
        return ultimoAcesso;
    }

    public void setUltimoAcesso(
            LocalDateTime ultimoAcesso) {

        this.ultimoAcesso = ultimoAcesso;
    }

    public Set<Role> getRoles() {
        return roles;
    }
}
