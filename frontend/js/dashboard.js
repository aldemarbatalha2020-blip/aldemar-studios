/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ====================================================== */

    const menuItems = document.querySelectorAll(".menu-item[data-section]");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("pageTitle");


    /* =====================================================
       USUÁRIO
    ====================================================== */

    const userNameElement =
        document.getElementById("userName");

    const welcomeNameElement =
        document.getElementById("welcomeName");

    const userAvatarElement =
        document.getElementById("userAvatar");

    const profileNameElement =
        document.getElementById("profileName");

    const profileEmailElement =
        document.getElementById("profileEmail");

    const profileAvatarElement =
        document.getElementById("profileAvatar");

    const profilePlanElement =
        document.getElementById("profilePlan");


    let user = null;


    /* =====================================================
       RECUPERAR USUÁRIO
    ====================================================== */

    try {

        user = JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        user = null;

    }


    const storedName =
        localStorage.getItem("userName") ||
        localStorage.getItem("name");


    const storedEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email");


    /*
       Caso o sistema tenha salvo os dados
       separadamente.
    */

    if (!user && storedName) {

        user = {

            name: storedName,

            email: storedEmail || ""

        };

    }


    /* =====================================================
       CONFIGURAR USUÁRIO
    ====================================================== */

    if (user) {

        const name =
            user.name ||
            user.nome ||
            user.fullName ||
            storedName ||
            "Usuário";


        const email =
            user.email ||
            user.emailAddress ||
            storedEmail ||
            "—";


        const initials =
            getInitials(name);


        if (userNameElement) {

            userNameElement.textContent =
                name;

        }


        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                firstName(name);

        }


        if (userAvatarElement) {

            userAvatarElement.textContent =
                initials;

        }


        if (profileNameElement) {

            profileNameElement.textContent =
                name;

        }


        if (profileEmailElement) {

            profileEmailElement.textContent =
                email;

        }


        if (profileAvatarElement) {

            profileAvatarElement.textContent =
                initials;

        }


        if (profilePlanElement) {

            profilePlanElement.textContent =
                user.plan ||
                user.plano ||
                "GRATUITO";

        }

    }


    /* =====================================================
       NAVEGAÇÃO PRINCIPAL
    ====================================================== */

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            const locked =
                item.dataset.locked === "true";


            if (locked) {

                showNotification(
                    "Esta área ainda está em desenvolvimento."
                );

                return;

            }


            const sectionName =
                item.dataset.section;


            if (!sectionName) return;


            showSection(sectionName);

        });

    });


    /* =====================================================
       CARDS DE ACESSO RÁPIDO
    ====================================================== */

    const accessCards =
        document.querySelectorAll(
            "[data-section-link]"
        );


    accessCards.forEach(card => {

        card.addEventListener("click", () => {

            const section =
                card.dataset.sectionLink;


            if (section) {

                showSection(section);

            }

        });

    });


    /* =====================================================
       FUNÇÃO PRINCIPAL DE NAVEGAÇÃO
    ====================================================== */

    window.showSection = function(sectionName) {

        sections.forEach(section => {

            section.classList.remove("active");

        });


        menuItems.forEach(item => {

            item.classList.remove("active");

        });


        const target =
            document.getElementById(sectionName);


        if (!target) {

            console.warn(
                `Seção "${sectionName}" não encontrada.`
            );

            return;

        }


        target.classList.add("active");


        const activeMenu =
            document.querySelector(
                `.menu-item[data-section="${sectionName}"]`
            );


        if (activeMenu) {

            activeMenu.classList.add("active");

        }


        updatePageTitle(sectionName);


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    /* =====================================================
       TÍTULOS DAS SEÇÕES
    ====================================================== */

    function updatePageTitle(sectionName) {

        if (!pageTitle) return;


        const titles = {

            inicio: "Início",

            jogos: "Jogos",

            cursos: "Cursos",

            ingles: "Inglês",

            musica: "Música",

            inclusivos: "Inclusivos",

            feedback: "Feedback",

            perfil: "Meu Perfil"

        };


        pageTitle.textContent =
            titles[sectionName] ||
            "Aldemar Studios";

    }


    /* =====================================================
       CATEGORIAS DE JOGOS
    ====================================================== */

    window.openGameCategory = function(category) {

        const categories =
            document.getElementById(
                "gamesCategories"
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

            categories.style.display =
                "none";

        }


        if (passatempo) {

            passatempo.style.display =
                category === "passatempo"
                    ? "block"
                    : "none";

        }


        if (educativos) {

            educativos.style.display =
                category === "educativos"
                    ? "block"
                    : "none";

        }

    };


    /* =====================================================
       VOLTAR PARA CATEGORIAS DE JOGOS
    ====================================================== */

    window.backToGameCategories = function() {

        const categories =
            document.getElementById(
                "gamesCategories"
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

            categories.style.display =
                "block";

        }


        if (passatempo) {

            passatempo.style.display =
                "none";

        }


        if (educativos) {

            educativos.style.display =
                "none";

        }

    };


    /* =====================================================
       FILTRO DOS JOGOS EDUCATIVOS
    ====================================================== */

    window.filterGames = function(filter, button) {

        const games =
            document.querySelectorAll(
                ".educational-game"
            );


        const filters =
            document.querySelectorAll(
                ".game-filter"
            );


        filters.forEach(item => {

            item.classList.remove(
                "active"
            );

        });


        if (button) {

            button.classList.add(
                "active"
            );

        }


        games.forEach(game => {

            const subject =
                game.dataset.subject;


            if (
                filter === "todos" ||
                subject === filter
            ) {

                game.style.display = "";

            } else {

                game.style.display =
                    "none";

            }

        });

    };


    /* =====================================================
       ABRIR CURSO
    ====================================================== */

    document.addEventListener("click", event => {

        const button =
            event.target.closest(
                "[data-open-course]"
            );


        if (!button) return;


        /*
           Caminho do curso dentro do GitHub Pages:

           /cursos/index.html
        */

        window.location.href =
            "cursos/index.html";

    });


    /* =====================================================
       ABRIR CURSO POR BOTÃO NORMAL
       Caso algum botão tenha classe específica.
    ====================================================== */

    const courseButtons =
        document.querySelectorAll(
            ".open-course-button"
        );


    courseButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cursos/index.html";

            }
        );

    });


    /* =====================================================
       BOTÕES DOS MÓDULOS
    ====================================================== */

    document.addEventListener("click", event => {

        const moduleButton =
            event.target.closest(
                "[data-module]"
            );


        if (!moduleButton) return;


        const module =
            moduleButton.dataset.module;


        console.log(
            "Módulo selecionado:",
            module
        );


        showNotification(
            `Módulo ${module} selecionado.`
        );

    });


    /* =====================================================
       FEEDBACK — ESTRELAS
    ====================================================== */

    const stars =
        document.querySelectorAll(
            ".stars button"
        );


    stars.forEach((star, index) => {

        star.addEventListener(
            "click",
            () => {

                stars.forEach(
                    (item, starIndex) => {

                        if (
                            starIndex <= index
                        ) {

                            item.classList.add(
                                "selected"
                            );

                        } else {

                            item.classList.remove(
                                "selected"
                            );

                        }

                    }
                );

            }
        );

    });


    /* =====================================================
       LOGOUT
    ====================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Deseja realmente sair da sua conta?"
                    );


                if (!confirmed) return;


                /*
                   Limpa os dados da sessão.
                */

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "userName"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                localStorage.removeItem(
                    "token"
                );


                window.location.href =
                    "index.html";

            }
        );

    }


    /* =====================================================
       NOTIFICAÇÃO
    ====================================================== */

    function showNotification(message) {

        let notification =
            document.getElementById(
                "dashboardNotification"
            );


        if (!notification) {

            notification =
                document.createElement(
                    "div"
                );


            notification.id =
                "dashboardNotification";


            notification.className =
                "dashboard-notification";


            document.body.appendChild(
                notification
            );

        }


        notification.textContent =
            message;


        notification.classList.add(
            "show"
        );


        clearTimeout(
            window.dashboardNotificationTimer
        );


        window.dashboardNotificationTimer =
            setTimeout(
                () => {

                    notification.classList.remove(
                        "show"
                    );

                },
                3000
            );

    }


    /* =====================================================
       PRIMEIRO NOME
    ====================================================== */

    function firstName(name) {

        if (!name) {

            return "usuário";

        }


        return name
            .trim()
            .split(/\s+/)[0];

    }


    /* =====================================================
       INICIAIS
    ====================================================== */

    function getInitials(name) {

        if (!name) {

            return "AS";

        }


        const parts =
            name
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    showSection("inicio");

});
