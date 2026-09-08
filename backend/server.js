const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { testarConexao } = require("./database/connection");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");
const planosRoutes = require("./routes/planos");
const adminRoutes = require("./routes/admin");
const { autenticarToken, exigirAdmin } = require("./middleware/auth");
const { exigirAssinatura } = require("./middleware/assinatura");
const { protegerAmbienteAluno } = require("./middleware/ambienteAluno");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";


// =========================================================
// CAMINHO DO FRONTEND
// =========================================================

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);


// =========================================================
// CONFIGURAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O DO CORS
// =========================================================

const allowedOrigins = [

    // Desenvolvimento local
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // GitHub Pages
    "https://aldemarbatalha2020-blip.github.io",

    // DomÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­nio oficial
    "https://aldemarstudios.com",
    "https://www.aldemarstudios.com"

];


app.use(
    cors({

        origin: function (origin, callback) {

            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {

                return callback(null, true);

            }

            console.warn(
                "Origem bloqueada pelo CORS:",
                origin
            );

            return callback(
                new Error(
                    "Origem nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o autorizada pelo CORS."
                )
            );

        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Accept",
            "Authorization"
        ],

        credentials: true

    })
);


// =========================================================
// MIDDLEWARES
// =========================================================

app.use(
    express.json({
        limit: "25mb"
    })
);


// =========================================================
// SERVIR FRONTEND
// =========================================================

 // =========================================================
 // AMBIENTE DO ALUNO — ACESSO EXCLUSIVO PARA ASSINANTES
 // =========================================================

 app.use(
    "/ambiente-aluno",
    (req, res, next) => {

        const cabecalho = req.headers.authorization;
        const possuiBearer =
            cabecalho &&
            cabecalho.startsWith("Bearer ");

        const possuiCookie =
            req.headers.cookie &&
            /(?:^|;\s*)token=([^;]+)/.test(req.headers.cookie);

        if (!possuiBearer && !possuiCookie) {
            return res.redirect("/acesso-premium.html");
        }

        next();
    },
    autenticarToken,
    protegerAmbienteAluno
);

app.use(
    express.static(frontendPath)
);


// =========================================================
// ROTA PRINCIPAL DA API
// =========================================================

app.get("/api", (req, res) => {

    res.status(200).json({

        sistema:
            "Aldemar Studios",

        status:
            "online",

        mensagem:
            "Backend funcionando corretamente!",

        ambiente:
            process.env.NODE_ENV || "development"

    });

});


// =========================================================
// ROTA DE SAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡DE DA API
// =========================================================

app.get("/health", (req, res) => {

    res.status(200).json({

        status:
            "ok",

        sistema:
            "Aldemar Studios",

        servidor:
            "online",

        timestamp:
            new Date().toISOString()

    });

});


// =========================================================
// ROTAS DE AUTENTICAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O
// =========================================================

app.use(
    "/api/auth",
    authRoutes
);


// =========================================================
// ROTAS DE USUÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂRIOS
// =========================================================

app.use(
    "/api/usuarios",
    usuariosRoutes
);

// =========================================================
// ROTAS DE PLANOS
// =========================================================

app.use(
    "/api/planos",
    planosRoutes
);


// =========================================================
// TRATAMENTO DE ROTA NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢O ENCONTRADA
// =========================================================



// =========================================================
// ROTAS ADMINISTRATIVAS
// =========================================================

app.use(
    "/api/admin",
    autenticarToken,
    exigirAdmin,
    adminRoutes
);

app.use(
    (req, res) => {

        res.status(404).json({

            sucesso:
                false,

            mensagem:
                "Rota nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o encontrada."

        });

    }
);


// =========================================================
// TRATAMENTO GLOBAL DE ERROS
// =========================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Erro global da API:",
            error
        );


        if (
            error.message ===
            "Origem nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o autorizada pelo CORS."
        ) {

            return res.status(403).json({

                sucesso:
                    false,

                mensagem:
                    "Origem nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o autorizada."

            });

        }


        return res.status(500).json({

            sucesso:
                false,

            mensagem:
                "Erro interno do servidor."

        });

    }
);


// =========================================================
// INICIAR SERVIDOR
// =========================================================

app.listen(
    PORT,
    HOST,
    async () => {

        console.log(
            "================================="
        );

        console.log(
            "       ALDEMAR STUDIOS"
        );

        console.log(
            "================================="
        );

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

        console.log(
            `Host: ${HOST}`
        );

        console.log(
            `Frontend: ${frontendPath}`
        );

        console.log(
            `Ambiente: ${
                process.env.NODE_ENV ||
                "development"
            }`
        );

        console.log(
            "================================="
        );


        await testarConexao();

    }
);





