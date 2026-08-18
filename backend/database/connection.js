const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");


// =========================================================
// CARREGAR .ENV DO BACKEND
// =========================================================

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});


// =========================================================
// CONFIGURAÇÃO DO MYSQL
// =========================================================

const pool = mysql.createPool({

    host:
        process.env.DB_HOST,

    user:
        process.env.DB_USER,

    password:
        process.env.DB_PASSWORD,

    database:
        process.env.DB_NAME,

    port:
        Number(process.env.DB_PORT) || 3306,

    waitForConnections:
        true,

    connectionLimit:
        10,

    queueLimit:
        0

});


// =========================================================
// TESTAR CONEXÃO
// =========================================================

async function testarConexao() {

    let connection;

    try {

        connection =
            await pool.getConnection();


        console.log(
            "================================="
        );

        console.log(
            "      MYSQL CONECTADO"
        );

        console.log(
            "================================="
        );

        console.log(
            `Host: ${process.env.DB_HOST}`
        );

        console.log(
            `Banco: ${process.env.DB_NAME}`
        );

        console.log(
            "Conexão estabelecida com sucesso!"
        );

        console.log(
            "================================="
        );


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "     ERRO NO MYSQL"
        );

        console.error(
            "================================="
        );

        console.error(
            error.message
        );

        console.error(
            "================================="
        );


    } finally {

        if (connection) {

            connection.release();

        }

    }

}


// =========================================================
// EXPORTAR
// =========================================================

module.exports = {

    pool,

    testarConexao

};