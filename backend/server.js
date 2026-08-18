const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { testarConexao } = require("./database/connection");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");

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
// CONFIGURAÇÃO DO CORS
// =========================================================

const allowedOrigins = [

    // Desenvolvimento local
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // GitHub Pages
    "https://aldemarbatalha2020-blip.github.io",

    // Domínio oficial
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
                    "Origem não autorizada pelo CORS."
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
// ROTA DE SAÚDE DA API
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
// ROTAS DE AUTENTICAÇÃO
// =========================================================

app.use(
    "/api/auth",
    authRoutes
);


// =========================================================
// ROTAS DE USUÁRIOS
// =========================================================

app.use(
    "/api/usuarios",
    usuariosRoutes
);


// =========================================================
// TRATAMENTO DE ROTA NÃO ENCONTRADA
// =========================================================

app.use(
    (req, res) => {

        res.status(404).json({

            sucesso:
                false,

            mensagem:
                "Rota não encontrada."

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
            "Origem não autorizada pelo CORS."
        ) {

            return res.status(403).json({

                sucesso:
                    false,

                mensagem:
                    "Origem não autorizada."

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