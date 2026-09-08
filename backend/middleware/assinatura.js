const { pool } = require("../database/connection");

async function exigirAssinatura(req, res, next) {
    try {

        if (!req.usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário não autenticado."
            });
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
            return res.status(403).json({
                sucesso: false,
                mensagem: "Acesso exclusivo para assinantes. Ative um plano para acessar o Ambiente do Aluno."
            });
        }

        req.assinatura = assinaturas[0];

        next();

    } catch (erro) {

        console.error(
            "Erro ao verificar assinatura:",
            erro
        );

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao verificar a assinatura."
        });
    }
}

module.exports = {
    exigirAssinatura
};
