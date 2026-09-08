const jwt = require("jsonwebtoken");
const { pool } = require("../database/connection");

async function autenticarToken(req, res, next) {
    try {
        const cabecalho = req.headers.authorization;

        let token = null;

        if (cabecalho && cabecalho.startsWith("Bearer ")) {
            token = cabecalho.substring(7).trim();
        }

        if (!token && req.headers.cookie) {
            const correspondencia = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);

            if (correspondencia) {
                token = decodeURIComponent(correspondencia[1]);
            }
        }

        if (!token) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token de autenticaÃ§Ã£o nÃ£o informado."
            });
        }


        const decodificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decodificado.sub) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token invÃ¡lido."
            });
        }

        const [usuarios] = await pool.query(
            `
            SELECT
                id,
                nome_completo,
                nick,
                email,
                foto,
                plano,
                status,
                tipo_conta
            FROM usuarios
            WHERE id = ?
            LIMIT 1
            `,
            [decodificado.sub]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "UsuÃ¡rio nÃ£o encontrado."
            });
        }

        const usuario = usuarios[0];

        if (usuario.status !== "ativo") {
            return res.status(403).json({
                sucesso: false,
                mensagem: "Esta conta nÃ£o estÃ¡ ativa."
            });
        }

        req.usuario = usuario;

        next();

    } catch (erro) {

        if (
            erro.name === "JsonWebTokenError" ||
            erro.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token invÃ¡lido ou expirado."
            });
        }

        console.error("Erro na autenticaÃ§Ã£o:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno ao autenticar usuÃ¡rio."
        });
    }
}

function exigirAdmin(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "UsuÃ¡rio nÃ£o autenticado."
        });
    }

    const emailAdmin = (
        process.env.ADMIN_EMAIL || ""
    ).trim().toLowerCase();

    const emailUsuario = (
        req.usuario.email || ""
    ).trim().toLowerCase();

    if (
        req.usuario.tipo_conta !== "admin" ||
        !emailAdmin ||
        emailUsuario !== emailAdmin
    ) {
        return res.status(403).json({
            sucesso: false,
            mensagem: "Acesso administrativo nÃ£o autorizado."
        });
    }

    next();
}

module.exports = {
    autenticarToken,
    exigirAdmin
};
