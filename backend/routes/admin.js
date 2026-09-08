const express = require("express");
const { pool } = require("../database/connection");

const router = express.Router();


// =========================================================
// CONFIRMAR ADMINISTRADOR
// =========================================================

router.get("/me", async (req, res) => {

    try {

        return res.json({
            sucesso: true,
            administrador: {
                id: req.usuario.id,
                nome_completo: req.usuario.nome_completo,
                nick: req.usuario.nick,
                email: req.usuario.email,
                foto: req.usuario.foto,
                tipo_conta: req.usuario.tipo_conta
            }
        });

    } catch (erro) {

        console.error("ERRO ADM /me:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao consultar administrador."
        });

    }

});


// =========================================================
// RESUMO DO SISTEMA
// =========================================================

router.get("/resumo", async (req, res) => {

    try {

        const [[total]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
        `);

        const [[ativos]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE status = 'ativo'
        `);

        const [[inativos]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE status = 'inativo'
        `);

        const [[bloqueados]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE status = 'bloqueado'
        `);

        const [[gratuitos]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE plano = 'gratuito'
        `);

        const [[bronze]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE plano = 'bronze'
        `);

        const [[prata]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE plano = 'prata'
        `);

        const [[ouro]] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM usuarios
            WHERE plano = 'ouro'
        `);

        return res.json({
            sucesso: true,
            resumo: {
                usuarios: Number(total.total),
                ativos: Number(ativos.total),
                inativos: Number(inativos.total),
                bloqueados: Number(bloqueados.total),
                planos: {
                    gratuito: Number(gratuitos.total),
                    bronze: Number(bronze.total),
                    prata: Number(prata.total),
                    ouro: Number(ouro.total)
                }
            }
        });

    } catch (erro) {

        console.error("ERRO ADM /resumo:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao carregar resumo administrativo."
        });

    }

});


// =========================================================
// LISTAR USUÁRIOS
// =========================================================

router.get("/usuarios", async (req, res) => {

    try {

        const [usuarios] = await pool.execute(`
            SELECT
                id,
                nome_completo,
                nick,
                email,
                foto,
                plano,
                status,
                tipo_conta,
                criado_em
            FROM usuarios
            ORDER BY criado_em DESC
        `);

        return res.json({
            sucesso: true,
            total: usuarios.length,
            usuarios
        });

    } catch (erro) {

        console.error("ERRO ADM /usuarios:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao carregar usuários."
        });

    }

});


// =========================================================
// ALTERAR STATUS
// =========================================================

router.patch("/usuarios/:id/status", async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = [
            "ativo",
            "inativo",
            "bloqueado"
        ];

        if (!statusPermitidos.includes(status)) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Status inválido."
            });

        }

        if (String(id) === String(req.usuario.id)) {

            return res.status(403).json({
                sucesso: false,
                mensagem: "A conta administrativa atual não pode alterar o próprio status."
            });

        }

        const [resultado] = await pool.execute(
            `
            UPDATE usuarios
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Usuário não encontrado."
            });

        }

        return res.json({
            sucesso: true,
            mensagem: "Status do usuário atualizado com sucesso.",
            status
        });

    } catch (erro) {

        console.error("ERRO ADM STATUS:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao alterar status do usuário."
        });

    }

});


// =========================================================
// ALTERAR PLANO
// =========================================================

router.patch("/usuarios/:id/plano", async (req, res) => {

    try {

        const { id } = req.params;
        const { plano } = req.body;

        const planosPermitidos = [
            "gratuito",
            "bronze",
            "prata",
            "ouro"
        ];

        if (!planosPermitidos.includes(plano)) {

            return res.status(400).json({
                sucesso: false,
                mensagem: "Plano inválido."
            });

        }

        const [resultado] = await pool.execute(
            `
            UPDATE usuarios
            SET plano = ?
            WHERE id = ?
            `,
            [plano, id]
        );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                sucesso: false,
                mensagem: "Usuário não encontrado."
            });

        }

        return res.json({
            sucesso: true,
            mensagem: "Plano atualizado com sucesso.",
            plano
        });

    } catch (erro) {

        console.error("ERRO ADM PLANO:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao alterar plano do usuário."
        });

    }

});


module.exports = router;