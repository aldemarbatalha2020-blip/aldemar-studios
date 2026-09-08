const express = require("express");

const router = express.Router();


// =========================================================
// PLANOS DISPONÍVEIS
// =========================================================

const planos = {

    bronze: {

        nome: "Bronze",

        descricao:
            "Acesso Premium básico ao Aldemar Studios.",

        beneficios: [
            "Jogos Premium",
            "Materiais Premium",
            "Conteúdos de Inglês Premium",
            "Novos conteúdos Premium"
        ],

        precos: {
            diario: 5.00,
            mensal: 30.00,
            anual: 300.00
        }

    },


    prata: {

        nome: "Prata",

        descricao:
            "Mais conteúdos e recursos para sua aprendizagem.",

        beneficios: [
            "Tudo do plano Bronze",
            "Simulados Premium",
            "Cursos Premium selecionados",
            "Conteúdos educacionais adicionais",
            "Novos conteúdos Premium"
        ],

        precos: {
            diario: 8.00,
            mensal: 50.00,
            anual: 500.00
        }

    },


    ouro: {

        nome: "Ouro",

        descricao:
            "Acesso completo ao Aldemar Studios.",

        beneficios: [
            "Tudo do plano Prata",
            "Todos os jogos Premium",
            "Todos os materiais Premium",
            "Todos os cursos",
            "Conteúdos exclusivos",
            "Novidades Premium",
            "Acesso completo à plataforma"
        ],

        precos: {
            diario: 12.00,
            mensal: 80.00,
            anual: 800.00
        }

    }

};


// =========================================================
// LISTAR PLANOS
// =========================================================

router.get("/", (req, res) => {

    return res.json({

        sucesso: true,

        planos

    });

});


module.exports = router;
