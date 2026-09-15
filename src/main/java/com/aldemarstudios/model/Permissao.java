package com.aldemarstudios.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "permissoes",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_permissao_codigo",
            columnNames = "codigo"
        )
    }
)
public class Permissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String codigo;

    @Column(length = 255)
    private String descricao;

    public Permissao() {
    }

    public Permissao(String codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}