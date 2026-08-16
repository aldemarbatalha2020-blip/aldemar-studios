const express = require("express");
const bcrypt = require("bcrypt");

const { pool } = require("../database/connection");

const router = express.Router();


// =========================================
// CADASTRO
// =========================================

router.post("/register", async (req, res) => {

    try {

        const {
            nome_completo,
            email,
            senha
        } = req.body;


        // VALIDAÇÕES

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
                mensagem: "A senha deve possuir pelo menos 8 caracteres."
            });

        }


        const emailNormalizado =
            email.trim().toLowerCase();


        // VERIFICAR EMAIL

        const [usuarios] = await pool.execute(
            "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
            [emailNormalizado]
        );


        if (usuarios.length > 0) {

            return res.status(409).json({
                sucesso: false,
                mensagem: "Este e-mail já está cadastrado."
            });

        }


        // CRIPTOGRAFAR SENHA

        const senhaHash =
            await bcrypt.hash(senha, 12);


        // CRIAR USUÁRIO

        const [resultado] = await pool.execute(
            `
            INSERT INTO usuarios
            (nome_completo, email, senha, plano, status)
            VALUES (?, ?, ?, 'gratuito', 'ativo')
            `,
            [
                nome_completo.trim(),
                emailNormalizado,
                senhaHash
            ]
        );


        return res.status(201).json({

            sucesso: true,

            mensagem: "Conta criada com sucesso!",

            usuario: {
                id: resultado.insertId,
                nome_completo: nome_completo.trim(),
                email: emailNormalizado,
                plano: "gratuito"
            }

        });


    } catch (error) {

        console.error(
            "Erro ao cadastrar usuário:",
            error
        );

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });

    }

});


// =========================================
// LOGIN
// =========================================

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

        const [usuarios] = await pool.execute(
            `
            SELECT
                id,
                nome_completo,
                email,
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


        const usuario = usuarios[0];


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

                id: usuario.id,

                nome_completo:
                    usuario.nome_completo,

                email:
                    usuario.email,

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


module.exports = router;