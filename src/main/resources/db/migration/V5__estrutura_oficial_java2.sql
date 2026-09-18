-- ============================================================
-- ALDEMAR STUDIOS
-- MIGRACAO V5
-- ESTRUTURA OFICIAL DO JAVA 2
-- NAO ALTERA A TABELA LEGADA usuarios
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_role_nome UNIQUE (nome)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT uk_permissao_codigo UNIQUE (codigo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios_java (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    nick VARCHAR(30) NULL,
    email VARCHAR(255) NOT NULL,
    foto LONGTEXT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    plano VARCHAR(20) NOT NULL DEFAULT 'GRATUITO',
    tipo_conta VARCHAR(20) NOT NULL DEFAULT 'USUARIO',
    status_conta VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    tentativas_login INT NOT NULL DEFAULT 0,
    ultima_tentativa_login DATETIME NULL,
    bloqueio_quantidade INT NOT NULL DEFAULT 0,
    bloqueado_ate DATETIME NULL,
    senha_atualizada_em DATETIME NULL,
    data_cadastro DATETIME NOT NULL,
    ultimo_acesso DATETIME NULL,

    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_java_email UNIQUE (email),
    CONSTRAINT uk_usuarios_java_nick UNIQUE (nick)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (usuario_id, role_id),

    CONSTRAINT fk_usuario_roles_usuario_java
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_java(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissoes (
    role_id BIGINT NOT NULL,
    permissao_id BIGINT NOT NULL,

    PRIMARY KEY (role_id, permissao_id),

    CONSTRAINT fk_role_permissoes_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissoes_permissao
        FOREIGN KEY (permissao_id)
        REFERENCES permissoes(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO roles (nome)
SELECT 'ALUNO'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'ALUNO');

INSERT INTO roles (nome)
SELECT 'PROFESSOR'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'PROFESSOR');

INSERT INTO roles (nome)
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'ADMIN');

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_LEITURA', 'Consultar dados basicos da propria conta'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_LEITURA');

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_EDICAO', 'Editar dados da propria conta'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_EDICAO');

INSERT INTO permissoes (codigo, descricao)
SELECT 'CURSO_ACESSO', 'Acessar cursos disponiveis'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'CURSO_ACESSO');

INSERT INTO permissoes (codigo, descricao)
SELECT 'JOGO_ACESSO', 'Acessar jogos educacionais'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'JOGO_ACESSO');

INSERT INTO permissoes (codigo, descricao)
SELECT 'CONTEUDO_PREMIUM', 'Acessar conteudo premium'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'CONTEUDO_PREMIUM');

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_GERENCIAR', 'Gerenciar usuarios'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_GERENCIAR');

INSERT INTO permissoes (codigo, descricao)
SELECT 'CURSO_GERENCIAR', 'Gerenciar cursos'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'CURSO_GERENCIAR');

INSERT INTO permissoes (codigo, descricao)
SELECT 'CONTEUDO_GERENCIAR', 'Gerenciar conteudos'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'CONTEUDO_GERENCIAR');

INSERT INTO permissoes (codigo, descricao)
SELECT 'ASSINATURA_GERENCIAR', 'Gerenciar assinaturas'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'ASSINATURA_GERENCIAR');

INSERT INTO permissoes (codigo, descricao)
SELECT 'AUDITORIA_LEITURA', 'Consultar registros de auditoria'
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE codigo = 'AUDITORIA_LEITURA');

INSERT INTO role_permissoes (role_id, permissao_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissoes p
WHERE r.nome = 'ALUNO'
AND p.codigo IN (
    'USUARIO_LEITURA',
    'USUARIO_EDICAO',
    'CURSO_ACESSO',
    'JOGO_ACESSO'
)
AND NOT EXISTS (
    SELECT 1 FROM role_permissoes rp
    WHERE rp.role_id = r.id
    AND rp.permissao_id = p.id
);

INSERT INTO role_permissoes (role_id, permissao_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissoes p
WHERE r.nome = 'PROFESSOR'
AND p.codigo IN (
    'USUARIO_LEITURA',
    'USUARIO_EDICAO',
    'CURSO_ACESSO',
    'JOGO_ACESSO',
    'CURSO_GERENCIAR',
    'CONTEUDO_GERENCIAR'
)
AND NOT EXISTS (
    SELECT 1 FROM role_permissoes rp
    WHERE rp.role_id = r.id
    AND rp.permissao_id = p.id
);

INSERT INTO role_permissoes (role_id, permissao_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissoes p
WHERE r.nome = 'ADMIN'
AND p.codigo IN (
    'USUARIO_LEITURA',
    'USUARIO_EDICAO',
    'CURSO_ACESSO',
    'JOGO_ACESSO',
    'CONTEUDO_PREMIUM',
    'USUARIO_GERENCIAR',
    'CURSO_GERENCIAR',
    'CONTEUDO_GERENCIAR',
    'ASSINATURA_GERENCIAR',
    'AUDITORIA_LEITURA'
)
AND NOT EXISTS (
    SELECT 1 FROM role_permissoes rp
    WHERE rp.role_id = r.id
    AND rp.permissao_id = p.id
);
