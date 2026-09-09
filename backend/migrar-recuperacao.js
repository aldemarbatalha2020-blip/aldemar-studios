const { pool } = require("./database/connection");

async function migrar() {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log("=================================");
        console.log(" VERIFICANDO TABELA USUARIOS");
        console.log("=================================");

        const [colunas] = await connection.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'usuarios'
        `);

        const existentes = new Set(
            colunas.map(c => c.COLUMN_NAME)
        );

        const campos = {
            codigo_recuperacao:
                "VARCHAR(6) NULL",

            codigo_recuperacao_expira:
                "DATETIME NULL",

            reset_token:
                "VARCHAR(255) NULL",

            reset_token_expira:
                "DATETIME NULL"
        };

        for (const [nome, definicao] of Object.entries(campos)) {

            if (existentes.has(nome)) {

                console.log(`OK - ${nome} já existe.`);

            } else {

                await connection.query(
                    `ALTER TABLE usuarios ADD COLUMN ${nome} ${definicao}`
                );

                console.log(`CRIADO - ${nome}`);
            }
        }

        console.log("");
        console.log("=================================");
        console.log(" MIGRACAO CONCLUIDA");
        console.log("=================================");

    } catch (erro) {

        console.error("");
        console.error("=================================");
        console.error(" ERRO NA MIGRACAO");
        console.error("=================================");
        console.error(erro.message);
        console.error("");

    } finally {

        if (connection) {
            connection.release();
        }

        await pool.end();
    }
}

migrar();
