-- ============================================================
-- ALDEMAR STUDIOS
-- MIGRACAO V2
-- CARGA INICIAL DE ROLES E PERMISSOES
-- ============================================================

INSERT INTO roles (nome)
SELECT 'ALUNO'
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE nome = 'ALUNO'
);

INSERT INTO roles (nome)
SELECT 'PROFESSOR'
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE nome = 'PROFESSOR'
);

INSERT INTO roles (nome)
SELECT 'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE nome = 'ADMIN'
);

-- ============================================================
-- PERMISSOES
-- ============================================================

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_LEITURA', 'Consultar dados básicos da própria conta'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_LEITURA'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_EDICAO', 'Editar dados da própria conta'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_EDICAO'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'CURSO_ACESSO', 'Acessar cursos disponíveis'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'CURSO_ACESSO'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'JOGO_ACESSO', 'Acessar jogos educacionais'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'JOGO_ACESSO'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'CONTEUDO_PREMIUM', 'Acessar conteúdo premium'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'CONTEUDO_PREMIUM'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'USUARIO_GERENCIAR', 'Gerenciar usuários'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'USUARIO_GERENCIAR'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'CURSO_GERENCIAR', 'Gerenciar cursos'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'CURSO_GERENCIAR'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'CONTEUDO_GERENCIAR', 'Gerenciar conteúdos'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'CONTEUDO_GERENCIAR'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'ASSINATURA_GERENCIAR', 'Gerenciar assinaturas'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'ASSINATURA_GERENCIAR'
);

INSERT INTO permissoes (codigo, descricao)
SELECT 'AUDITORIA_LEITURA', 'Consultar registros de auditoria'
WHERE NOT EXISTS (
    SELECT 1 FROM permissoes WHERE codigo = 'AUDITORIA_LEITURA'
);

-- ============================================================
-- ALUNO
-- ============================================================

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
    SELECT 1
    FROM role_permissoes rp
    WHERE rp.role_id = r.id
      AND rp.permissao_id = p.id
);

-- ============================================================
-- PROFESSOR
-- ============================================================

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
    SELECT 1
    FROM role_permissoes rp
    WHERE rp.role_id = r.id
      AND rp.permissao_id = p.id
);

-- ============================================================
-- ADMIN
-- ============================================================

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
    SELECT 1
    FROM role_permissoes rp
    WHERE rp.role_id = r.id
      AND rp.permissao_id = p.id
);