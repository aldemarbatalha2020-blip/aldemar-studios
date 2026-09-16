-- ============================================================
-- ALDEMAR STUDIOS
-- MIGRACAO V3
-- REFORCO DE SEGURANCA DA AUTENTICACAO
-- ============================================================

ALTER TABLE usuarios
    ADD COLUMN ultima_tentativa_login DATETIME NULL;

ALTER TABLE usuarios
    ADD COLUMN bloqueio_quantidade INT NOT NULL DEFAULT 0;

ALTER TABLE usuarios
    ADD COLUMN senha_atualizada_em DATETIME NULL;

CREATE INDEX idx_usuarios_bloqueado_ate
    ON usuarios (bloqueado_ate);

CREATE INDEX idx_usuarios_email_verificado
    ON usuarios (email_verificado);