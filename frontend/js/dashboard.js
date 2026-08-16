// =========================================
// USUÁRIO
// =========================================

const usuarioSalvo =
    sessionStorage.getItem("usuario");


// =========================================
// PROTEGER PAINEL
// =========================================

if (!usuarioSalvo) {

    window.location.href = "index.html";

}


// =========================================
// CARREGAR USUÁRIO
// =========================================

let usuario = null;

try {

    usuario = JSON.parse(usuarioSalvo);

} catch (error) {

    sessionStorage.removeItem("usuario");

    window.location.href = "index.html";

}


// =========================================
// ELEMENTOS
// =========================================

const userName =
    document.getElementById("userName");

const welcomeName =
    document.getElementById("welcomeName");

const userPlan =
    document.getElementById("userPlan");

const userAvatar =
    document.getElementById("userAvatar");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePlan =
    document.getElementById("profilePlan");

const pageTitle =
    document.getElementById("pageTitle");


// =========================================
// INFORMAÇÕES DO USUÁRIO
// =========================================

if (usuario) {

    const nome =
        usuario.nome_completo || "Usuário";

    const iniciais =
        nome
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(nome => nome.charAt(0))
            .join("")
            .toUpperCase();


    if (userName)
        userName.textContent = nome;


    if (welcomeName)
        welcomeName.textContent =
            nome.split(" ")[0];


    if (userPlan)
        userPlan.textContent =
            (usuario.plano || "gratuito").toUpperCase();


    if (userAvatar)
        userAvatar.textContent = iniciais;


    if (profileAvatar)
        profileAvatar.textContent = iniciais;


    if (profileName)
        profileName.textContent =
            usuario.nome_completo;


    if (profileEmail)
        profileEmail.textContent =
            usuario.email;


    if (profilePlan)
        profilePlan.textContent =
            (usuario.plano || "gratuito").toUpperCase();

}


// =========================================
// MENU
// =========================================

const menuItems =
    document.querySelectorAll(".menu-item");

const sections =
    document.querySelectorAll(".content-section");


// =========================================
// FUNÇÃO PRINCIPAL DE NAVEGAÇÃO
// =========================================

function showSection(sectionId) {

    const section =
        document.getElementById(sectionId);


    if (!section) {
        return;
    }


    // Fechar áreas internas dos jogos
    resetGameAreas();


    // Remover ativos
    menuItems.forEach(menu => {

        menu.classList.remove("active");

    });


    sections.forEach(section => {

        section.classList.remove("active");

    });


    // Ativar seção
    section.classList.add("active");


    // Encontrar item correspondente
    const menu =
        document.querySelector(
            `.menu-item[data-section="${sectionId}"]`
        );


    if (menu) {

        menu.classList.add("active");


        const texto =
            menu.querySelector("span:nth-child(2)");


        if (texto && pageTitle) {

            pageTitle.textContent =
                texto.textContent.trim();

        }

    }

}


// =========================================
// EVENTOS DO MENU
// =========================================

menuItems.forEach(item => {

    item.addEventListener("click", () => {


        // =====================================
        // ÁREA BLOQUEADA
        // =====================================

        if (item.dataset.locked === "true") {

            alert(
                "🔒 Esta área está em desenvolvimento.\n\n" +
                "Estamos preparando novos conteúdos para " +
                "as próximas atualizações do Aldemar Studios!"
            );

            return;

        }


        const sectionId =
            item.dataset.section;


        if (!sectionId) {
            return;
        }


        showSection(sectionId);

    });

});


// =========================================
// CARDS DA HOME
// =========================================

const accessCards =
    document.querySelectorAll(
        "[data-section-link]"
    );


accessCards.forEach(card => {

    card.addEventListener("click", () => {

        const sectionId =
            card.dataset.sectionLink;


        if (!sectionId) {
            return;
        }


        showSection(sectionId);

    });

});


// =========================================================
// JOGOS
// =========================================================


// =========================================
// ABRIR CATEGORIA
// =========================================

function openGameCategory(category) {

    const categories =
        document.querySelector(
            ".game-category-grid"
        );

    const passatempo =
        document.getElementById(
            "passatempoArea"
        );

    const educativos =
        document.getElementById(
            "educativosArea"
        );


    if (
        !categories ||
        !passatempo ||
        !educativos
    ) {

        return;

    }


    // Esconder categorias
    categories.style.display = "none";


    // Esconder áreas
    passatempo.style.display = "none";

    educativos.style.display = "none";


    // Abrir categoria escolhida
    if (category === "passatempo") {

        passatempo.style.display = "block";

    }


    if (category === "educativos") {

        educativos.style.display = "block";

    }

}


// =========================================
// VOLTAR PARA CATEGORIAS DE JOGOS
// =========================================

function backToGameCategories() {

    const categories =
        document.querySelector(
            ".game-category-grid"
        );

    const passatempo =
        document.getElementById(
            "passatempoArea"
        );

    const educativos =
        document.getElementById(
            "educativosArea"
        );


    if (
        !categories ||
        !passatempo ||
        !educativos
    ) {

        return;

    }


    // Fechar áreas
    passatempo.style.display = "none";

    educativos.style.display = "none";


    // Mostrar categorias
    categories.style.display = "grid";

}


// =========================================
// RESETAR ÁREAS DOS JOGOS
// =========================================

function resetGameAreas() {

    const categories =
        document.querySelector(
            ".game-category-grid"
        );

    const passatempo =
        document.getElementById(
            "passatempoArea"
        );

    const educativos =
        document.getElementById(
            "educativosArea"
        );


    if (categories) {

        categories.style.display = "grid";

    }


    if (passatempo) {

        passatempo.style.display = "none";

    }


    if (educativos) {

        educativos.style.display = "none";

    }

}


// =========================================
// FILTRO DOS JOGOS EDUCATIVOS
// =========================================

function filterGames(subject, button) {

    const games =
        document.querySelectorAll(
            ".educational-game"
        );

    const filters =
        document.querySelectorAll(
            ".game-filter"
        );


    // Remover seleção
    filters.forEach(filter => {

        filter.classList.remove("active");

    });


    // Ativar botão escolhido
    if (button) {

        button.classList.add("active");

    }


    // Filtrar jogos
    games.forEach(game => {

        if (subject === "todos") {

            game.style.display = "block";

            return;

        }


        if (
            game.dataset.subject === subject
        ) {

            game.style.display = "block";

        } else {

            game.style.display = "none";

        }

    });

}


// =========================================================
// LOGOUT
// =========================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair da sua conta?"
                );


            if (!confirmar) {
                return;
            }


            sessionStorage.removeItem(
                "usuario"
            );


            window.location.href =
                "index.html";

        }
    );

}