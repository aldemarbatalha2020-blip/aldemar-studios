const express = require("express");
const bcrypt = require("bcrypt");

const { pool } = require("../database/connection");

const router = express.Router();


// =========================================================
// BUSCAR USUÁRIO
// =========================================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Usuário não informado."
            });

        }


        const [usuarios] = await pool.execute(
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
                mensagem: "Usuário não encontrado."
            });

        }


        const usuario = usuarios[0];


        return res.status(200).json({

            sucesso: true,

            usuario: {

                id: usuario.id,

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

                status:
                    usuario.status
            }

        });

    } catch (error) {

        console.error(
            "Erro ao buscar usuário:",
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

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nome_completo,
            nick,
            email
        } = req.body;


        // =====================================================
        // VALIDAR ID
        // =====================================================

        if (!id) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Usuário não informado."

            });

        }


        // =====================================================
        // VALIDAR NOME
        // =====================================================

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


        // =====================================================
        // VALIDAR E-MAIL
        // =====================================================

        if (!email) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Digite seu e-mail."

            });

        }


        const emailNormalizado =
            email.trim().toLowerCase();


        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(emailNormalizado)
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Digite um e-mail válido."

            });

        }


        // =====================================================
        // NORMALIZAR NICK
        // =====================================================

        const nickNormalizado =
            nick
                ? nick.trim()
                : null;


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


            if (
                !/^[a-zA-Z0-9_.-]+$/
                    .test(nickNormalizado)
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "O nick pode conter apenas letras, números, ponto, hífen e underline."

                });

            }

        }


        // =====================================================
        // VERIFICAR SE USUÁRIO EXISTE
        // =====================================================

        const [usuarioExistente] =
            await pool.execute(
                `
                SELECT
                    id,
                    foto
                FROM usuarios
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (usuarioExistente.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    "Usuário não encontrado."

            });

        }


        // =====================================================
        // VERIFICAR E-MAIL DUPLICADO
        // =====================================================

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


        // =====================================================
        // VERIFICAR NICK DUPLICADO
        // =====================================================

        if (nickNormalizado) {

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


        // =====================================================
        // ATUALIZAR
        // =====================================================

        await pool.execute(
            `
            UPDATE usuarios
            SET
                nome_completo = ?,
                nick = ?,
                email = ?
            WHERE id = ?
            `,
            [
                nome_completo.trim(),
                nickNormalizado || null,
                emailNormalizado,
                id
            ]
        );


        // =====================================================
        // BUSCAR USUÁRIO ATUALIZADO
        // =====================================================

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


        const usuario =
            usuarios[0];


        // =====================================================
        // RESPOSTA
        // =====================================================

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
                    usuario.plano,

                status:
                    usuario.status

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
// ATUALIZAR FOTO
// =========================================================

router.put("/:id/foto", async (req, res) => {

    try {

        const { id } = req.params;

        const { foto } = req.body;


        if (!id) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Usuário não informado."

            });

        }


        // =====================================================
        // VALIDAR FOTO
        // =====================================================

        if (
            foto !== null &&
            foto !== undefined &&
            typeof foto !== "string"
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Foto inválida."

            });

        }


        // =====================================================
        // LIMITE DA FOTO
        // =====================================================

        if (
            typeof foto === "string" &&
            foto.length > 7 * 1024 * 1024
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A imagem é muito grande."

            });

        }


        // =====================================================
        // VERIFICAR USUÁRIO
        // =====================================================

        const [usuariosExistentes] =
            await pool.execute(
                `
                SELECT id
                FROM usuarios
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (usuariosExistentes.length === 0) {

            return res.status(404).json({

                sucesso: false,

                mensagem:
                    "Usuário não encontrado."

            });

        }


        // =====================================================
        // SALVAR FOTO
        // =====================================================

        await pool.execute(
            `
            UPDATE usuarios
            SET foto = ?
            WHERE id = ?
            `,
            [
                foto || null,
                id
            ]
        );


        // =====================================================
        // BUSCAR DADOS ATUALIZADOS
        // =====================================================

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


        const usuario =
            usuarios[0];


        return res.status(200).json({

            sucesso: true,

            mensagem:
                foto
                    ? "Foto de perfil atualizada!"
                    : "Foto de perfil removida.",

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

                status:
                    usuario.status

            }

        });

    } catch (error) {

        console.error(
            "Erro ao atualizar foto:",
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

router.put("/:id/senha", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            senha_atual,
            nova_senha
        } = req.body;


        // =====================================================
        // VALIDAR
        // =====================================================

        if (
            !senha_atual ||
            !nova_senha
        ) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "Preencha todos os campos."

            });

        }


        if (nova_senha.length < 8) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A nova senha deve possuir pelo menos 8 caracteres."

            });

        }


        if (senha_atual === nova_senha) {

            return res.status(400).json({

                sucesso: false,

                mensagem:
                    "A nova senha deve ser diferente da senha atual."

            });

        }


        // =====================================================
        // BUSCAR USUÁRIO
        // =====================================================

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


        // =====================================================
        // STATUS
        // =====================================================

        if (usuario.status !== "ativo") {

            return res.status(403).json({

                sucesso: false,

                mensagem:
                    "Esta conta não está disponível."

            });

        }


        // =====================================================
        // CONFERIR SENHA ATUAL
        // =====================================================

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


        // =====================================================
        // CRIPTOGRAFAR NOVA SENHA
        // =====================================================

        const novaSenhaHash =
            await bcrypt.hash(
                nova_senha,
                12
            );


        // =====================================================
        // SALVAR
        // =====================================================

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


        // =====================================================
        // RESPOSTA
        // =====================================================

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


module.exports = router;