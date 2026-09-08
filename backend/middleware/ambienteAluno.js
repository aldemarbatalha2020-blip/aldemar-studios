const { pool } = require("../database/connection");

async function protegerAmbienteAluno(req, res, next) {
    try {

        if (!req.usuario) {
            return res.redirect("/acesso-premium.html");
        }

        const [assinaturas] = await pool.query(
            `
            SELECT
                id,
                plano,
                periodo,
                inicio,
                expira_em,
                status
            FROM assinaturas
            WHERE usuario_id = ?
              AND plano IN ('bronze', 'prata', 'ouro')
              AND status = 'ativa'
              AND (expira_em IS NULL OR expira_em > NOW())
            ORDER BY
                CASE WHEN expira_em IS NULL THEN 1 ELSE 0 END DESC,
                expira_em DESC,
                id DESC
            LIMIT 1
            `,
            [req.usuario.id]
        );

        if (assinaturas.length === 0) {
            return res.redirect("/acesso-premium.html");
        }

        req.assinatura = assinaturas[0];

        next();

    } catch (erro) {

        console.error(
            "Erro ao proteger o Ambiente do Aluno:",
            erro
        );

        return res.redirect("/acesso-premium.html");
    }
}

module.exports = {
    protegerAmbienteAluno
};
