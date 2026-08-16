/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   VERSÃO ATUALIZADA
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

    const pageTitle =
        document.getElementById("pageTitle");


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

    const userPlanElement =
        document.getElementById("userPlan");


    /* =====================================================
       RECUPERAÇÃO DO USUÁRIO
       
       O LOGIN SALVA EM:
       
       sessionStorage:
       "usuario"
    ====================================================== */

    let user = null;


    try {

        const savedUser =
            sessionStorage.getItem("usuario");


        if (savedUser) {

            user = JSON.parse(savedUser);

        }

    } catch (error) {

        console.warn(
            "Não foi possível ler os dados da sessão.",
            error
        );

        sessionStorage.removeItem("usuario");

        user = null;

    }


    /* =====================================================
       FALLBACK PARA SISTEMAS ANTIGOS
       
       Mantemos esta parte para evitar problemas caso
       existam dados antigos no localStorage.
    ====================================================== */

    if (!user) {

        try {

            const oldUser =
                localStorage.getItem("user");


            if (oldUser) {

                user = JSON.parse(oldUser);

            }

        } catch (error) {

            console.warn(
                "Não foi possível ler dados antigos.",
                error
            );

        }

    }


    /* =====================================================
       FALLBACK PARA DADOS INDIVIDUAIS
    ====================================================== */

    const storedName =
        localStorage.getItem("userName") ||
        localStorage.getItem("name");

    const storedEmail =
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email");


    if (!user && storedName) {

        user = {

            nome_completo: storedName,

            email: storedEmail || "",

            plano: "gratuito"

        };

    }


    /* =====================================================
       CONFIGURAÇÃO DO USUÁRIO
    ====================================================== */

    if (user) {

        /*
         * O backend atualmente retorna:
         *
         * nome_completo
         * email
         * plano
         *
         * Também mantemos compatibilidade com nomes
         * usados em versões anteriores.
         */

        const name =
            user.nome_completo ||
            user.name ||
            user.nome ||
            user.fullName ||
            user.fullname ||
            storedName ||
            "Usuário";


        const email =
            user.email ||
            user.emailAddress ||
            storedEmail ||
            "—";


        const plan =
            user.plano ||
            user.plan ||
            "GRATUITO";


        const initials =
            getInitials(name);


        /* =================================================
           HEADER
        ================================================== */

        if (userNameElement) {

            userNameElement.textContent =
                name;

        }


        if (userPlanElement) {

            userPlanElement.textContent =
                String(plan).toUpperCase();

        }


        if (userAvatarElement) {

            userAvatarElement.textContent =
                initials;

        }


        /* =================================================
           BOAS-VINDAS
           
           Exemplo:
           
           Olá, Aldemar! 👋
        ================================================== */

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                firstName(name);

        }


        /* =================================================
           PERFIL
        ================================================== */

        if (profileNameElement) {

            profileNameElement.textContent =
                name;

        }


        if (profileEmailElement) {

            profileEmailElement.textContent =
                email;

        }


        if (profilePlanElement) {

            profilePlanElement.textContent =
                String(plan).toUpperCase();

        }


        if (profileAvatarElement) {

            profileAvatarElement.textContent =
                initials;

        }


    } else {

        /*
         * Caso não exista sessão, mantemos os valores
         * padrão da interface.
         */

        if (userNameElement) {

            userNameElement.textContent =
                "Usuário";

        }


        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                "usuário";

        }


        if (userAvatarElement) {

            userAvatarElement.textContent =
                "AS";

        }


        if (profileNameElement) {

            profileNameElement.textContent =
                "—";

        }


        if (profileEmailElement) {

            profileEmailElement.textContent =
                "—";

        }


        if (profilePlanElement) {

            profilePlanElement.textContent =
                "GRATUITO";

        }


        if (userPlanElement) {

            userPlanElement.textContent =
                "GRATUITO";

        }


        if (profileAvatarElement) {

            profileAvatarElement.textContent =
                "AS";

        }

    }


    /* =====================================================
       NAVEGAÇÃO DO MENU
    ====================================================== */

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            const locked =
                item.dataset.locked === "true";


            /* ÁREA BLOQUEADA */

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


            /* =================================================
               CURSOS
            ================================================= */

            if (sectionName === "cursos") {

                openCourses();

                return;

            }


            /* OUTRAS SEÇÕES */

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


            if (!section) {

                return;

            }


            /* CURSOS */

            if (section === "cursos") {

                openCourses();

                return;

            }


            showSection(section);

        });

    });


    /* =====================================================
       ABRIR PROJETO DE CURSOS
    ====================================================== */

    function openCourses() {

        window.location.href =
            "cursos/index.html";

    }


    window.openCourses =
        openCourses;


    /* =====================================================
       NAVEGAÇÃO ENTRE SEÇÕES
    ====================================================== */

    window.showSection =
        function(sectionName) {

            sections.forEach(section => {

                section.classList.remove(
                    "active"
                );

            });


            menuItems.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


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


            target.classList.add(
                "active"
            );


            const activeMenu =
                document.querySelector(
                    `.menu-item[data-section="${sectionName}"]`
                );


            if (activeMenu) {

                activeMenu.classList.add(
                    "active"
                );

            }


            updatePageTitle(
                sectionName
            );


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

            ingles:
                "Inglês",

            musica:
                "Música",

            inclusivos:
                "Inclusivos",

            cursos:
                "Cursos",

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
       VOLTAR PARA CATEGORIAS DOS JOGOS
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
       BOTÕES QUE POSSAM ABRIR CURSOS
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


            openCourses();

        }
    );


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


                if (!confirmed) {

                    return;

                }


                /*
                 * Sessão atual criada pelo login.
                 */

                sessionStorage.removeItem(
                    "usuario"
                );


                /*
                 * Dados antigos de versões anteriores.
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