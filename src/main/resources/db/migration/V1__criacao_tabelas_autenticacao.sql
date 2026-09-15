-- ============================================================
-- ALDEMAR STUDIOS
-- MIGRACAO V1
-- ESTRUTURA DE AUTENTICACAO
-- ============================================================

CREATE TABLE roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_role_nome UNIQUE (nome)
) ENGINE=InnoDB;

CREATE TABLE permissoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT uk_permissao_codigo UNIQUE (codigo)
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    tentativas_login INT NOT NULL DEFAULT 0,
    bloqueado_ate DATETIME NULL,
    data_cadastro DATETIME NOT NULL,
    ultimo_acesso DATETIME NULL,

    PRIMARY KEY (id),

    CONSTRAINT uk_usuario_email
        UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (
        usuario_id,
        role_id
    ),

    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE role_permissoes (
    role_id BIGINT NOT NULL,
    permissao_id BIGINT NOT NULL,

    PRIMARY KEY (
        role_id,
        permissao_id
    ),

    CONSTRAINT fk_role_permissoes_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissoes_permissao
        FOREIGN KEY (permissao_id)
        REFERENCES permissoes(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;