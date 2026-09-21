-- ============================================================
-- ALDEMAR STUDIOS
-- MIGRACAO V6
-- RECUPERACAO DE SENHA
-- ============================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    token VARCHAR(100) NOT NULL,
    criado_em DATETIME NOT NULL,
    expira_em DATETIME NOT NULL,
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    usado BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (id),

    CONSTRAINT fk_password_reset_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_java(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_password_reset_token
        UNIQUE (token),

    INDEX idx_password_reset_usuario (usuario_id),
    INDEX idx_password_reset_codigo (codigo),
    INDEX idx_password_reset_expira (expira_em)
) ENGINE=InnoDB;
