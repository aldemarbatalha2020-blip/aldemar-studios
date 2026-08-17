const express = require("express");
const bcrypt = require("bcrypt");

const { pool } = require("../database/connection");

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

        const [resultado] =
            await pool.execute(
                `
                INSERT INTO usuarios
                (
                    nome_completo,
                    email,
                    senha,
                    plano,
                    status
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    'gratuito',
                    'ativo'
                )
                `,
                [
                    nome_completo.trim(),
                    emailNormalizado,
                    senhaHash
                ]
            );


        // =====================================
        // RESPOSTA
        // =====================================

        return res.status(201).json({

            sucesso: true,

            mensagem:
                "Conta criada com sucesso!",

            usuario: {

                id:
                    resultado.insertId,

                nome_completo:
                    nome_completo.trim(),

                nick:
                    null,

                email:
                    emailNormalizado,

                foto:
                    null,

                plano:
                    "gratuito"

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

    try {

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
        // BUSCAR USUÁRIO
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
                    senha,
                    plano,
                    status
                FROM usuarios
                WHERE email = ?
                LIMIT 1
                `,
                [emailNormalizado]
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
        // COMPARAR SENHA
        // =====================================

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                usuario.senha
            );


        if (!senhaCorreta) {

            return res.status(401).json({

                sucesso: false,

                mensagem:
                    "E-mail ou senha incorretos."

            });

        }


        // =====================================
        // LOGIN AUTORIZADO
        // =====================================

        return res.status(200).json({

            sucesso: true,

            mensagem:
                "Login realizado com sucesso!",

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
            "Erro ao realizar login:",
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
// EXPORTAR ROTAS
// =========================================================

module.exports = router;