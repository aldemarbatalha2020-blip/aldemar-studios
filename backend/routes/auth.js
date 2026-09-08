const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { enviarEmail } = require("../services/email");
const { pool } = require("../database/connection");
const jwt = require("jsonwebtoken");

const router = express.Router();


// =========================================================
// CADASTRO
// =========================================================

router.post("/register", async (req, res) => {

    try {

        const {
            nome_completo,
            email,
            senha
        } = req.body;


        // =====================================
        // VALIDAÇÕES
        // =====================================

        if (!nome_completo || !email || !senha) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos."
            });

        }


        if (nome_completo.trim().length < 3) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Digite seu nome completo."
            });

        }


        if (senha.length < 8) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "A senha deve possuir pelo menos 8 caracteres."
            });

        }


        const emailNormalizado =
            email.trim().toLowerCase();


        // =====================================
        // VERIFICAR E-MAIL
        // =====================================

        const [usuarios] =
            await pool.execute(
                `
                SELECT id
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [emailNormalizado]
            );


        if (usuarios.length > 0) {

            return res.status(409).json({
                sucesso: false,
                mensagem:
                    "Este e-mail já está cadastrado."
            });

        }


        // =====================================
        // CRIPTOGRAFAR SENHA
        // =====================================

        const senhaHash =
            await bcrypt.hash(senha, 12);


        // =====================================
        // CRIAR USUÁRIO
        // =====================================

        await pool.execute(
            `
            INSERT INTO usuarios
            (
                nome_completo,
                email,
                senha,
                plano,
                status,
                tipo_conta
            )
            VALUES
            (
                ?,
                ?,
                ?,
                'gratuito',
                'ativo',
                'usuario'
            )
            `,
            [
                nome_completo.trim(),
                emailNormalizado,
                senhaHash
            ]
        );


        // =====================================
        // BUSCAR USUÁRIO CRIADO
        // =====================================

        const [usuariosCriados] =
            await pool.execute(
                `
                SELECT
                    id,
                    nome_completo,
                    nick,
                    email,
                    foto,
                    plano,
                    tipo_conta
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [emailNormalizado]
            );


        const usuarioCriado =
            usuariosCriados[0];


        // =====================================
        // RESPOSTA
        // =====================================

        return res.status(201).json({

            sucesso: true,

            mensagem:
                "Conta criada com sucesso!",

            usuario: {

                id:
                    usuarioCriado.id,

                nome_completo:
                    usuarioCriado.nome_completo,

                nick:
                    usuarioCriado.nick,

                email:
                    usuarioCriado.email,

                foto:
                    usuarioCriado.foto,

                plano:
                    usuarioCriado.plano,

                tipo_conta:
                    usuarioCriado.tipo_conta

            }

        });


    } catch (error) {

        console.error(
            "Erro ao cadastrar usuário:",
            error
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// LOGIN
// =========================================================

router.post("/login", async (req, res) => {

    const inicioLogin = Date.now();

    try {

        console.log("🔵 LOGIN INICIADO");

        const {
            email,
            senha
        } = req.body;


        // =====================================
        // VALIDAR CAMPOS
        // =====================================

        if (!email || !senha) {

            return res.status(400).json({
                sucesso: false,
                mensagem:
                    "Informe seu e-mail e sua senha."
            });

        }


        const emailNormalizado =
            email.trim().toLowerCase();


        // =====================================
        // TESTAR MYSQL
        // =====================================

        const inicioMysql = Date.now();

        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id,
                    nome_completo,
                    nick,
                    email,
                    foto,
                    senha,
                    plano,
                    status,
                    tipo_conta
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [emailNormalizado]
            );

        console.log(
            `🟡 MYSQL: ${Date.now() - inicioMysql} ms`
        );


        // =====================================
        // USUÁRIO NÃO ENCONTRADO
        // =====================================

        if (usuarios.length === 0) {

            return res.status(401).json({
                sucesso: false,
                mensagem:
                    "E-mail ou senha incorretos."
            });

        }


        const usuario =
            usuarios[0];


        // =====================================
        // VERIFICAR STATUS
        // =====================================

        if (usuario.status !== "ativo") {

            return res.status(403).json({
                sucesso: false,
                mensagem:
                    "Esta conta não está disponível."
            });

        }


        // =====================================
        // TESTAR BCRYPT
        // =====================================

        const inicioBcrypt = Date.now();

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        console.log(
            `🟠 BCRYPT: ${Date.now() - inicioBcrypt} ms`
        );


        if (!senhaCorreta) {

            return res.status(401).json({
                sucesso: false,
                mensagem:
                    "E-mail ou senha incorretos."
            });

        }


        // =====================================
        // GERAR TOKEN JWT
        // =====================================

        const token = jwt.sign(
            {
                sub: usuario.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );


        // =====================================
        // TEMPO TOTAL
        // =====================================

        console.log(
            `🟢 LOGIN TOTAL: ${Date.now() - inicioLogin} ms`
        );


        // =====================================
        // LOGIN AUTORIZADO
        // =====================================

        // =====================================
        // COOKIE DE AUTENTICAÇÃO
        // =====================================

        const cookieToken =
            `token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800`;

        res.setHeader(
            "Set-Cookie",
            cookieToken
        );

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Login realizado com sucesso!",

            token,

            usuario: {

                id:
                    usuario.id,

                nome_completo:
                    usuario.nome_completo,

                nick:
                    usuario.nick,

                email:
                    usuario.email,

                foto:
                    usuario.foto,

                plano:
                    usuario.plano,

                tipo_conta:
                    usuario.tipo_conta

            }

        });


    } catch (error) {

        console.error(
            "🔴 ERRO AO REALIZAR LOGIN:",
            error
        );

        console.log(
            `🔴 LOGIN COM ERRO: ${Date.now() - inicioLogin} ms`
        );

        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// ATUALIZAR PERFIL
// =========================================================

router.put("/profile", async (req, res) => {

    try {

        const {
            id,
            nome_completo,
            nick,
            email,
            foto
        } = req.body;


        // =====================================
        // VALIDAR ID
        // =====================================

        if (!id) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Usuário não informado."

            });

        }


        // =====================================
        // VALIDAR NOME
        // =====================================

        if (
            !nome_completo ||
            nome_completo.trim().length < 3
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Digite seu nome completo."

            });

        }


        // =====================================
        // VALIDAR E-MAIL
        // =====================================

        if (!email) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Digite seu e-mail."

            });

        }


        const emailNormalizado =
            email.trim().toLowerCase();


        // =====================================
        // NORMALIZAR NICK
        // =====================================

        const nickNormalizado =
            nick
                ? nick.trim()
                : null;


        // =====================================
        // VERIFICAR E-MAIL
        // =====================================

        const [emailExistente] =
            await pool.execute(
                `
                SELECT id
                FROM usuarios
                WHERE email = ?
                AND id <> ?
                LIMIT 1
                `,
                [
                    emailNormalizado,
                    id
                ]
            );


        if (emailExistente.length > 0) {

            return res.status(409).json({

                sucesso: false,

                mensagem:
                    "Este e-mail já está sendo utilizado."

            });

        }


        // =====================================
        // VERIFICAR NICK
        // =====================================

        if (nickNormalizado) {

            if (nickNormalizado.length < 3) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "O nick deve possuir pelo menos 3 caracteres."

                });

            }


            if (nickNormalizado.length > 30) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "O nick deve possuir no máximo 30 caracteres."

                });

            }


            const [nickExistente] =
                await pool.execute(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE nick = ?
                    AND id <> ?
                    LIMIT 1
                    `,
                    [
                        nickNormalizado,
                        id
                    ]
                );


            if (nickExistente.length > 0) {

                return res.status(409).json({

                    sucesso: false,

                    mensagem:
                        "Este nick já está sendo utilizado."

                });

            }

        }


        // =====================================
        // ATUALIZAR USUÁRIO
        // =====================================

        await pool.execute(
            `
            UPDATE usuarios
            SET
                nome_completo = ?,
                nick = ?,
                email = ?,
                foto = ?
            WHERE id = ?
            `,
            [
                nome_completo.trim(),
                nickNormalizado || null,
                emailNormalizado,
                foto || null,
                id
            ]
        );


        // =====================================
        // BUSCAR DADOS ATUALIZADOS
        // =====================================

        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id,
                    nome_completo,
                    nick,
                    email,
                    foto,
                    plano,
                    status
                FROM usuarios
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (usuarios.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    "Usuário não encontrado."

            });

        }


        const usuario =
            usuarios[0];


        // =====================================
        // RESPOSTA
        // =====================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Perfil atualizado com sucesso!",

            usuario: {

                id:
                    usuario.id,

                nome_completo:
                    usuario.nome_completo,

                nick:
                    usuario.nick,

                email:
                    usuario.email,

                foto:
                    usuario.foto,

                plano:
                    usuario.plano

            }

        });


    } catch (error) {

        console.error(
            "Erro ao atualizar perfil:",
            error
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// ALTERAR SENHA
// =========================================================

router.put("/password", async (req, res) => {

    try {

        const {
            id,
            senha_atual,
            nova_senha
        } = req.body;


        // =====================================
        // VALIDAR CAMPOS
        // =====================================

        if (
            !id ||
            !senha_atual ||
            !nova_senha
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Preencha todos os campos."

            });

        }


        // =====================================
        // VALIDAR NOVA SENHA
        // =====================================

        if (nova_senha.length < 8) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A nova senha deve possuir pelo menos 8 caracteres."

            });

        }


        // =====================================
        // BUSCAR USUÁRIO
        // =====================================

        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id,
                    senha,
                    status
                FROM usuarios
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (usuarios.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    "Usuário não encontrado."

            });

        }


        const usuario =
            usuarios[0];


        // =====================================
        // VERIFICAR STATUS
        // =====================================

        if (usuario.status !== "ativo") {

            return res.status(403).json({

                sucesso: false,

                mensagem:
                    "Esta conta não está disponível."

            });

        }


        // =====================================
        // VERIFICAR SENHA ATUAL
        // =====================================

        const senhaCorreta =
            await bcrypt.compare(
                senha_atual,
                usuario.senha
            );


        if (!senhaCorreta) {

            return res.status(401).json({

                sucesso: false,

                mensagem:
                    "A senha atual está incorreta."

            });

        }


        // =====================================
        // CRIPTOGRAFAR NOVA SENHA
        // =====================================

        const novaSenhaHash =
            await bcrypt.hash(
                nova_senha,
                12
            );


        // =====================================
        // SALVAR NOVA SENHA
        // =====================================

        await pool.execute(
            `
            UPDATE usuarios
            SET senha = ?
            WHERE id = ?
            `,
            [
                novaSenhaHash,
                id
            ]
        );


        // =====================================
        // SUCESSO
        // =====================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Senha alterada com sucesso!"

        });


    } catch (error) {

        console.error(
            "Erro ao alterar senha:",
            error
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// RECUPERAÇÃO DE SENHA
// =========================================================

router.post("/forgot-password", async (req, res) => {

    try {

        const email =
            String(req.body.email || "")
                .trim()
                .toLowerCase();


        // =====================================
        // VALIDAR E-MAIL
        // =====================================

        if (!email) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Informe seu e-mail."

            });

        }


        // =====================================
        // BUSCAR USUÁRIO
        // =====================================

        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id,
                    email,
                    nome_completo,
                    status
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            );


        // =====================================
        // RESPOSTA GENÉRICA
        // =====================================

        if (usuarios.length === 0) {

            return res.status(200).json({

                sucesso: true,

                mensagem:
                    "Se o e-mail estiver cadastrado, um código de recuperação será enviado."

            });

        }


        const usuario = usuarios[0];


        // =====================================
        // VERIFICAR STATUS
        // =====================================

        if (usuario.status !== "ativo") {

            return res.status(200).json({

                sucesso: true,

                mensagem:
                    "Se o e-mail estiver cadastrado, um código de recuperação será enviado."

            });

        }


        // =====================================
        // GERAR CÓDIGO DE 6 DÍGITOS
        // =====================================

        const codigo =
            crypto
                .randomInt(100000, 1000000)
                .toString();


        // =====================================
        // VALIDADE
        // 10 MINUTOS
        // =====================================

        const expiracao =
            new Date(
                Date.now() + 10 * 60 * 1000
            );


        // =====================================
        // ENVIAR E-MAIL PRIMEIRO
        // =====================================

        await enviarEmail({

            para:
                usuario.email,

            assunto:
                "Código de recuperação de senha - Aldemar Studios",

            texto:
                `Olá, ${usuario.nome_completo}.

Seu código de recuperação de senha é:

${codigo}

Este código é válido por 10 minutos.

Se você não solicitou a recuperação de senha, ignore este e-mail.

Aldemar Studios`,

            html:
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">

                    <h2>
                        Recuperação de senha
                    </h2>

                    <p>
                        Olá, <strong>${usuario.nome_completo}</strong>.
                    </p>

                    <p>
                        Recebemos uma solicitação para redefinir
                        a senha da sua conta no Aldemar Studios.
                    </p>

                    <p>
                        Seu código de recuperação é:
                    </p>

                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 0;">
                        ${codigo}
                    </div>

                    <p>
                        Este código é válido por
                        <strong>10 minutos</strong>.
                    </p>

                    <p>
                        Se você não solicitou a recuperação de senha,
                        ignore este e-mail.
                    </p>

                    <hr>

                    <p>
                        Aldemar Studios
                    </p>

                </div>
                `

        });


        // =====================================
        // SALVAR CÓDIGO APÓS ENVIO
        // =====================================

        await pool.execute(
            `
            UPDATE usuarios
            SET
                codigo_recuperacao = ?,
                codigo_recuperacao_expira = ?,
                reset_token = NULL,
                reset_token_expira = NULL
            WHERE id = ?
            `,
            [
                codigo,
                expiracao,
                usuario.id
            ]
        );


        // =====================================
        // RESPOSTA
        // =====================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Se o e-mail estiver cadastrado, um código de recuperação será enviado."

        });


    } catch (error) {

        console.error(
            "Erro ao solicitar recuperação de senha:",
            error
        );


        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Não foi possível enviar o código de recuperação."

        });

    }

});


// =========================================================
// VERIFICAR CÓDIGO DE RECUPERAÇÃO
// =========================================================

router.post("/verify-code", async (req, res) => {

    try {

        const email =
            String(req.body.email || "")
                .trim()
                .toLowerCase();

        const codigo =
            String(req.body.codigo || "")
                .trim();


        // =====================================
        // VALIDAR CAMPOS
        // =====================================

        if (!email || !codigo) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "E-mail e código são obrigatórios."

            });

        }


        // =====================================
        // VALIDAR FORMATO DO CÓDIGO
        // =====================================

        if (!/^\d{6}$/.test(codigo)) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Código inválido."

            });

        }


        // =====================================
        // BUSCAR USUÁRIO
        // =====================================

        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id,
                    email,
                    codigo_recuperacao,
                    codigo_recuperacao_expira,
                    status
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            );


        // =====================================
        // USUÁRIO NÃO ENCONTRADO
        // =====================================

        if (usuarios.length === 0) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Código inválido."

            });

        }


        const usuario = usuarios[0];


        // =====================================
        // VERIFICAR STATUS
        // =====================================

        if (usuario.status !== "ativo") {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Código inválido."

            });

        }


        // =====================================
        // VERIFICAR SE EXISTE CÓDIGO
        // =====================================

        if (!usuario.codigo_recuperacao) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Código inválido."

            });

        }


        // =====================================
        // VERIFICAR EXPIRAÇÃO
        // =====================================

        if (
            !usuario.codigo_recuperacao_expira ||
            new Date(usuario.codigo_recuperacao_expira) <= new Date()
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "O código expirou. Solicite um novo código."

            });

        }


        // =====================================
        // COMPARAR CÓDIGO
        // =====================================

        if (usuario.codigo_recuperacao !== codigo) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Código inválido."

            });

        }


        // =====================================
        // GERAR TOKEN DE REDEFINIÇÃO
        // =====================================

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        const resetTokenExpira =
            new Date(
                Date.now() + 10 * 60 * 1000
            );


        // =====================================
        // SALVAR TOKEN E INVALIDAR CÓDIGO
        // =====================================

        await pool.execute(
            `
            UPDATE usuarios
            SET
                reset_token = ?,
                reset_token_expira = ?,
                codigo_recuperacao = NULL,
                codigo_recuperacao_expira = NULL
            WHERE id = ?
            `,
            [
                resetToken,
                resetTokenExpira,
                usuario.id
            ]
        );


        // =====================================
        // SUCESSO
        // =====================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Código validado com sucesso.",

            token:
                resetToken

        });

    } catch (error) {

        console.error(
            "Erro ao verificar código de recuperação:",
            error
        );

        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// REDEFINIR SENHA
// =========================================================

router.post("/reset-password", async (req, res) => {

    try {

        const {
            token,
            nova_senha
        } = req.body;


        if (!token || !nova_senha) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Token e nova senha são obrigatórios."

            });

        }


        if (nova_senha.length < 8) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A nova senha deve possuir pelo menos 8 caracteres."

            });

        }


        const [usuarios] =
            await pool.execute(
                `
                SELECT
                    id
                FROM usuarios
                WHERE
                    reset_token = ?
                    AND reset_token_expira IS NOT NULL
                    AND reset_token_expira > NOW()
                LIMIT 1
                `,
                [token]
            );


        if (usuarios.length === 0) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Token inválido ou expirado."

            });

        }


        const senhaHash =
            await bcrypt.hash(
                nova_senha,
                10
            );


        await pool.execute(
            `
            UPDATE usuarios
            SET
                senha = ?,
                reset_token = NULL,
                reset_token_expira = NULL
            WHERE id = ?
            `,
            [
                senhaHash,
                usuarios[0].id
            ]
        );


        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Senha redefinida com sucesso!"

        });


    } catch (error) {

        console.error(
            "Erro ao redefinir senha:",
            error
        );

        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."

        });

    }

});


// =========================================================
// EXPORTAR ROTAS
// =========================================================

module.exports = router;

