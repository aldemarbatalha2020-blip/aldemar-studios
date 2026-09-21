package com.aldemarstudios.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assinaturas")
public class Assinatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "usuario_id",
        nullable = false
    )
    private Long usuarioId;

    @Column(
        name = "plano",
        nullable = false,
        length = 255
    )
    private String plano;

    @Column(
        name = "periodo",
        nullable = false,
        length = 255
    )
    private String periodo;

    @Column(
        name = "valor",
        nullable = false,
        precision = 10,
        scale = 0
    )
    private BigDecimal valor;

    @Column(
        name = "status",
        nullable = false,
        length = 255
    )
    private String status;

    @Column(
        name = "inicio",
        nullable = false
    )
    private LocalDateTime inicio;

    @Column(
        name = "expira_em"
    )
    private LocalDateTime expiraEm;

    @Column(
        name = "provedor",
        length = 255
    )
    private String provedor;

    @Column(
        name = "referencia_externa",
        length = 255
    )
    private String referenciaExterna;

    @Column(
        name = "criado_em",
        nullable = false
    )
    private LocalDateTime criadoEm;

    @Column(
        name = "atualizado_em",
        nullable = false
    )
    private LocalDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getPlano() {
        return plano;
    }

    public void setPlano(String plano) {
        this.plano = plano;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public void setInicio(LocalDateTime inicio) {
        this.inicio = inicio;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }

    public String getProvedor() {
        return provedor;
    }

    public void setProvedor(String provedor) {
        this.provedor = provedor;
    }

    public String getReferenciaExterna() {
        return referenciaExterna;
    }

    public void setReferenciaExterna(String referenciaExterna) {
        this.referenciaExterna = referenciaExterna;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public boolean estaAtiva() {

        if (!"ativa".equalsIgnoreCase(status)) {
            return false;
        }

        LocalDateTime agora = LocalDateTime.now();

        if (inicio != null && agora.isBefore(inicio)) {
            return false;
        }

        return expiraEm == null || agora.isBefore(expiraEm);
    }
}
