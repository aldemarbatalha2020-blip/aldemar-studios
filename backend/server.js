const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testarConexao } = require("./database/connection");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 3000;


// =========================================
// MIDDLEWARES
// =========================================

app.use(cors());
app.use(express.json());


// =========================================
// ROTA PRINCIPAL
// =========================================

app.get("/", (req, res) => {

    res.json({
        sistema: "Aldemar Studios",
        status: "online",
        mensagem: "Backend funcionando corretamente!"
    });

});


// =========================================
// ROTAS DE AUTENTICAÇÃO
// =========================================

app.use("/api/auth", authRoutes);


// =========================================
// SERVIDOR
// =========================================

app.listen(PORT, async () => {

    console.log("=================================");
    console.log("       ALDEMAR STUDIOS");
    console.log("=================================");
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");

    await testarConexao();

});