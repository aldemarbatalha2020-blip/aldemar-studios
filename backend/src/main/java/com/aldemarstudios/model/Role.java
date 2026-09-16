package com.aldemarstudios.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
    name = "roles",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_role_nome",
            columnNames = "nome"
        )
    }
)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NomeRole nome;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissoes",
        joinColumns = @JoinColumn(
            name = "role_id",
            nullable = false
        ),
        inverseJoinColumns = @JoinColumn(
            name = "permissao_id",
            nullable = false
        )
    )
    private Set<Permissao> permissoes = new HashSet<>();

    public Role() {
    }

    public Role(NomeRole nome) {
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public NomeRole getNome() {
        return nome;
    }

    public void setNome(NomeRole nome) {
        this.nome = nome;
    }

    public Set<Permissao> getPermissoes() {
        return permissoes;
    }

    public void setPermissoes(Set<Permissao> permissoes) {
        this.permissoes = permissoes;
    }

    public void adicionarPermissao(Permissao permissao) {
        permissoes.add(permissao);
    }

    public void removerPermissao(Permissao permissao) {
        permissoes.remove(permissao);
    }

    public enum NomeRole {
        ALUNO,
        PROFESSOR,
        ADMIN
    }
}