
/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   Sistema de navegação do painel
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ====================================================== */

    const menuItems = document.querySelectorAll(
        ".menu-item[data-section]"
    );

    const sections = document.querySelectorAll(
        ".content-section"
    );

    const pageTitle = document.getElementById(
        "pageTitle"
    );


    /* =====================================================
       ELEMENTOS DO USUÁRIO
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


    /* =====================================================
       RECUPERAÇÃO DO USUÁRIO
    ====================================================== */

    let user = null;


    /*
       Primeiro tentamos recuperar o objeto completo.
    */

    try {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            user = JSON.parse(storedUser);

        }

    } catch (error) {

        console.warn(
            "Não foi possível ler os dados do usuário.",
            error
        );

        user = null;

    }


    /*
       Recuperação alternativa.
       Isso ajuda caso o login tenha salvo os dados
       separadamente.
    */

    const storedName =
        localStorage.getItem("userName") ||
        localStorage.getItem("name") ||
        localStorage.getItem("nome") ||
        "";

    const storedEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        "";


    /*
       Caso não exista objeto "user", criamos um
       usando os dados individuais.
    */

    if (!user && (storedName || storedEmail)) {

        user = {

            name: storedName,

            email: storedEmail

        };

    }


    /* =====================================================
       CONFIGURAÇÃO DO USUÁRIO
    ====================================================== */

    if (user) {

        /*
           Aceitamos diferentes nomes de propriedades
           para manter compatibilidade com o sistema.
        */

        const name =
            user.name ||
            user.nome ||
            user.fullName ||
            user.fullname ||
            user.displayName ||
            storedName ||
            "Usuário";


        const email =
            user.email ||
            user.emailAddress ||
            user.mail ||
            storedEmail ||
            "—";


        const plan =
            user.plan ||
            user.plano ||
            user.subscription ||
            "GRATUITO";


        const initials =
            getInitials(name);


        /*
           Nome no topo
        */

        if (userNameElement) {

            userNameElement.textContent =
                name;

        }


        /*
           Nome na mensagem de boas-vindas
        */

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                firstName(name);

        }


        /*
           Avatar do topo
        */

        if (userAvatarElement) {

            userAvatarElement.textContent =
                initials;

        }


        /*
           Perfil
        */

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
                plan.toUpperCase();

        }

    } else {

        /*
           Caso realmente não exista nenhum dado.
        */

        if (userNameElement) {

            userNameElement.textContent =
                "Visitante";

        }

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                "Visitante";

        }

        if (profileNameElement) {

            profileNameElement.textContent =
                "Não informado";

        }

        if (profileEmailElement) {

            profileEmailElement.textContent =
                "Não informado";

        }

    }


    /* =====================================================
       NAVEGAÇÃO PRINCIPAL
    ====================================================== */

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            /*
               Áreas bloqueadas
            */

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


            if (!sectionName) {

                return;

            }


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
       NAVEGAÇÃO ENTRE SEÇÕES
    ====================================================== */

    window.showSection =
        function(sectionName) {

            /*
               Esconde todas as seções
            */

            sections.forEach(section => {

                section.classList.remove(
                    "active"
                );

            });


            /*
               Remove menu ativo
            */

            menuItems.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            /*
               Procura a seção desejada
            */

            const target =
                document.getElementById(
                    sectionName
                );


            if (!target) {

                console.warn(
                    `Seção "${sectionName}" não encontrada.`
                );

                return;

            }


            /*
               Ativa a seção
            */

            target.classList.add(
                "active"
            );


            /*
               Ativa o botão correspondente
            */

            const activeMenu =
                document.querySelector(
                    `.menu-item[data-section="${sectionName}"]`
                );


            if (activeMenu) {

                activeMenu.classList.add(
                    "active"
                );

            }


            /*
               Atualiza título
            */

            updatePageTitle(
                sectionName
            );


            /*
               Volta para o topo
            */

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        };


    /* =====================================================
       TÍTULOS DAS SEÇÕES
    ====================================================== */

    function updatePageTitle(sectionName) {

        if (!pageTitle) {

            return;

        }


        const titles = {

            inicio:
                "Início",

            jogos:
                "Jogos",

            cursos:
                "Cursos",

            ingles:
                "Inglês",

            musica:
                "Música",

            inclusivos:
                "Inclusivos",

            feedback:
                "Feedback",

            perfil:
                "Meu Perfil"

        };


        pageTitle.textContent =
            titles[sectionName] ||
            "Aldemar Studios";

    }


    /* =====================================================
       CATEGORIAS DE JOGOS
    ====================================================== */

    window.openGameCategory =
        function(category) {

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

    window.backToGameCategories =
        function() {

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

    window.filterGames =
        function(filter, button) {

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

                    game.style.display =
                        "";

                } else {

                    game.style.display =
                        "none";

                }

            });

        };


    /* =====================================================
       ABERTURA DE CURSO
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-open-course]"
                );


            if (!button) {

                return;

            }


            showSection(
                "cursos"
            );

        }
    );


    /* =====================================================
       MÓDULOS DO CURSO
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            const moduleButton =
                event.target.closest(
                    "[data-module]"
                );


            if (!moduleButton) {

                return;

            }


            const module =
                moduleButton.dataset.module;


            /*
               Quando a estrutura das aulas estiver pronta,
               esta função poderá abrir o módulo diretamente.
            */

            console.log(
                "Módulo selecionado:",
                module
            );


            showNotification(
                `Módulo ${module} selecionado.`
            );

        }
    );


    /* =====================================================
       FEEDBACK
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


                if (!confirmed) {

                    return;

                }


                /*
                   Remove somente os dados relacionados
                   à sessão.
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
                    "name"
                );

                localStorage.removeItem(
                    "nome"
                );

                localStorage.removeItem(
                    "email"
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
       NOTIFICAÇÕES
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

