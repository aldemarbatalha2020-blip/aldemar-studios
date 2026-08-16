/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   VERSÃO COMPLETA
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
       RECUPERAR USUÁRIO
    ====================================================== */

    let user = null;

    try {

        const savedUser =
            sessionStorage.getItem("usuario");

        if (savedUser) {

            user = JSON.parse(savedUser);

        }

    } catch (error) {

        console.error(
            "Erro ao recuperar usuário:",
            error
        );

        sessionStorage.removeItem("usuario");

        user = null;

    }


    /* =====================================================
       FALLBACK
    ====================================================== */

    if (!user) {

        const localUser =
            localStorage.getItem("user");

        if (localUser) {

            try {

                user = JSON.parse(localUser);

            } catch (error) {

                console.warn(
                    "Dados antigos de usuário inválidos."
                );

            }

        }

    }


    /* =====================================================
       SE NÃO EXISTIR USUÁRIO
    ====================================================== */

    if (!user) {

        console.warn(
            "Nenhum usuário encontrado."
        );

    }


    /* =====================================================
       NORMALIZAÇÃO DOS DADOS
    ====================================================== */

    function getUserName() {

        if (!user) {
            return "Usuário";
        }

        return (
            user.nome_completo ||
            user.name ||
            user.nome ||
            user.fullName ||
            "Usuário"
        );

    }


    function getUserEmail() {

        if (!user) {
            return "—";
        }

        return (
            user.email ||
            user.emailAddress ||
            "—"
        );

    }


    function getUserPlan() {

        if (!user) {
            return "gratuito";
        }

        return (
            user.plano ||
            user.plan ||
            "gratuito"
        );

    }


    function getUserNick() {

        if (!user) {
            return "";
        }

        return (
            user.nick ||
            user.nickname ||
            ""
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
       ATUALIZAR INTERFACE DO USUÁRIO
    ====================================================== */

    function updateUserInterface() {

        if (!user) {
            return;
        }


        const name =
            getUserName();

        const email =
            getUserEmail();

        const plan =
            getUserPlan();

        const nick =
            getUserNick();

        const initials =
            getInitials(name);


        /* =============================================
           HEADER
        ============================================== */

        if (userNameElement) {

            userNameElement.textContent =
                name;

        }


        if (userPlanElement) {

            userPlanElement.textContent =
                String(plan).toUpperCase();

        }


        if (userAvatarElement) {

            updateAvatarElement(
                userAvatarElement,
                initials
            );

        }


        /* =============================================
           BOAS-VINDAS
        ============================================== */

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                firstName(name);

        }


        /* =============================================
           PERFIL
        ============================================== */

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

            updateAvatarElement(
                profileAvatarElement,
                initials
            );

        }


        /* =============================================
           CAMPOS DE EDIÇÃO
        ============================================== */

        const editName =
            document.getElementById("editProfileName");

        const editNick =
            document.getElementById("editProfileNick");

        const editEmail =
            document.getElementById("editProfileEmail");


        if (editName) {

            editName.value =
                name;

        }


        if (editNick) {

            editNick.value =
                nick;

        }


        if (editEmail) {

            editEmail.value =
                email === "—"
                    ? ""
                    : email;

        }


        /* =============================================
           FOTO DO USUÁRIO
        ============================================== */

        if (user.foto) {

            applyUserPhoto(
                user.foto
            );

        }

    }


    /* =====================================================
       AVATAR
    ====================================================== */

    function updateAvatarElement(
        element,
        initials
    ) {

        if (!element) {
            return;
        }


        if (user && user.foto) {

            element.style.backgroundImage =
                `url("${user.foto}")`;

            element.style.backgroundSize =
                "cover";

            element.style.backgroundPosition =
                "center";

            element.style.backgroundRepeat =
                "no-repeat";

            element.textContent =
                "";

        } else {

            element.style.backgroundImage =
                "";

            element.textContent =
                initials;

        }

    }


    /* =====================================================
       APLICAR FOTO
    ====================================================== */

    function applyUserPhoto(photo) {

        if (!photo) {
            return;
        }


        const avatars = [
            userAvatarElement,
            profileAvatarElement
        ];


        avatars.forEach(avatar => {

            if (!avatar) {
                return;
            }


            avatar.style.backgroundImage =
                `url("${photo}")`;

            avatar.style.backgroundSize =
                "cover";

            avatar.style.backgroundPosition =
                "center";

            avatar.style.backgroundRepeat =
                "no-repeat";

            avatar.textContent =
                "";

        });

    }


    /* =====================================================
       SALVAR USUÁRIO NA SESSÃO
    ====================================================== */

    function saveUser() {

        try {

            sessionStorage.setItem(
                "usuario",
                JSON.stringify(user)
            );

            /*
             * Mantemos também uma cópia local
             * para compatibilidade com versões
             * anteriores do sistema.
             */

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

        } catch (error) {

            console.error(
                "Erro ao salvar usuário:",
                error
            );

        }

    }


    /* =====================================================
       INICIALIZAR USUÁRIO
    ====================================================== */

    updateUserInterface();


    /* =====================================================
       NAVEGAÇÃO DO MENU
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


            if (!sectionName) {
                return;
            }


            if (sectionName === "cursos") {

                openCourses();

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


            if (!section) {
                return;
            }


            if (section === "cursos") {

                openCourses();

                return;

            }


            showSection(section);

        });

    });


    /* =====================================================
       ABRIR CURSOS
    ====================================================== */

    function openCourses() {

        window.location.href =
            "cursos/index.html";

    }


    window.openCourses =
        openCourses;


    /* =====================================================
       MOSTRAR SEÇÃO
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


            /*
             * Se abrir o perfil,
             * atualizamos os dados novamente.
             */

            if (sectionName === "perfil") {

                updateUserInterface();

            }


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        };


    /* =====================================================
       TÍTULOS
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
       VOLTAR PARA CATEGORIAS
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
       BOTÕES DE CURSO
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
       =====================================================
       PERFIL DO USUÁRIO
       =====================================================
       ===================================================== */


    /* =====================================================
       BOTÃO EDITAR PERFIL
    ====================================================== */

    const editProfileButton =
        document.getElementById(
            "editProfileButton"
        );


    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            () => {

                openProfileEditor();

            }
        );

    }


    /* =====================================================
       ABRIR EDITOR DE PERFIL
    ====================================================== */

    function openProfileEditor() {

        const editor =
            document.getElementById(
                "profileEditArea"
            );


        if (!editor) {

            showNotification(
                "Área de edição não encontrada."
            );

            return;

        }


        updateUserInterface();


        editor.style.display =
            "block";


        editor.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    /* =====================================================
       BOTÃO CANCELAR EDIÇÃO
    ====================================================== */

    const cancelProfileButton =
        document.getElementById(
            "cancelProfileEdit"
        );


    if (cancelProfileButton) {

        cancelProfileButton.addEventListener(
            "click",
            () => {

                const editor =
                    document.getElementById(
                        "profileEditArea"
                    );


                if (editor) {

                    editor.style.display =
                        "none";

                }


                updateUserInterface();

            }
        );

    }


    /* =====================================================
       SALVAR PERFIL
    ====================================================== */

    const profileForm =
        document.getElementById(
            "profileEditForm"
        );


    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!user) {

                    showNotification(
                        "Usuário não encontrado."
                    );

                    return;

                }


                const nameInput =
                    document.getElementById(
                        "editProfileName"
                    );

                const nickInput =
                    document.getElementById(
                        "editProfileNick"
                    );

                const emailInput =
                    document.getElementById(
                        "editProfileEmail"
                    );


                const newName =
                    nameInput
                        ? nameInput.value.trim()
                        : "";


                const newNick =
                    nickInput
                        ? nickInput.value.trim()
                        : "";


                const newEmail =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                /* =====================================
                   VALIDAÇÃO DO NOME
                ====================================== */

                if (!newName) {

                    showNotification(
                        "Digite seu nome completo."
                    );

                    if (nameInput) {
                        nameInput.focus();
                    }

                    return;

                }


                /* =====================================
                   VALIDAÇÃO DO E-MAIL
                ====================================== */

                if (!newEmail) {

                    showNotification(
                        "Digite seu e-mail."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                if (
                    !isValidEmail(newEmail)
                ) {

                    showNotification(
                        "Digite um e-mail válido."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;

                }


                /* =====================================
                   ATUALIZAR OBJETO
                ====================================== */

                user.nome_completo =
                    newName;

                user.email =
                    newEmail;

                user.nick =
                    newNick;


                /* =====================================
                   SALVAR
                ====================================== */

                saveUser();


                /* =====================================
                   ATUALIZAR INTERFACE
                ====================================== */

                updateUserInterface();


                /* =====================================
                   FECHAR EDITOR
                ====================================== */

                const editor =
                    document.getElementById(
                        "profileEditArea"
                    );


                if (editor) {

                    editor.style.display =
                        "none";

                }


                showNotification(
                    "Perfil atualizado com sucesso!"
                );

            }
        );

    }


    /* =====================================================
       VALIDAÇÃO DE E-MAIL
    ====================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================================
       FOTO DE PERFIL
    ====================================================== */

    const profilePhotoInput =
        document.getElementById(
            "profilePhotoInput"
        );


    if (profilePhotoInput) {

        profilePhotoInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) {
                    return;
                }


                /* =====================================
                   VERIFICAR TIPO
                ====================================== */

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showNotification(
                        "Selecione uma imagem válida."
                    );

                    profilePhotoInput.value =
                        "";

                    return;

                }


                /* =====================================
                   LIMITE DE TAMANHO
                ====================================== */

                const maxSize =
                    5 * 1024 * 1024;


                if (file.size > maxSize) {

                    showNotification(
                        "A imagem deve ter no máximo 5 MB."
                    );

                    profilePhotoInput.value =
                        "";

                    return;

                }


                /* =====================================
                   LER IMAGEM
                ====================================== */

                const reader =
                    new FileReader();


                reader.onload =
                    function(readerEvent) {

                        const photo =
                            readerEvent.target.result;


                        if (!user) {
                            return;
                        }


                        user.foto =
                            photo;


                        saveUser();


                        applyUserPhoto(
                            photo
                        );


                        showNotification(
                            "Foto de perfil atualizada!"
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       BOTÃO ALTERAR FOTO
    ====================================================== */

    const changePhotoButton =
        document.getElementById(
            "changeProfilePhoto"
        );


    if (
        changePhotoButton &&
        profilePhotoInput
    ) {

        changePhotoButton.addEventListener(
            "click",
            () => {

                profilePhotoInput.click();

            }
        );

    }


    /* =====================================================
       REMOVER FOTO
    ====================================================== */

    const removePhotoButton =
        document.getElementById(
            "removeProfilePhoto"
        );


    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            () => {

                if (!user) {
                    return;
                }


                user.foto =
                    "";


                saveUser();


                updateUserInterface();


                if (profilePhotoInput) {

                    profilePhotoInput.value =
                        "";

                }


                showNotification(
                    "Foto de perfil removida."
                );

            }
        );

    }


    /* =====================================================
       ALTERAR SENHA
    ====================================================== */

    const passwordForm =
        document.getElementById(
            "changePasswordForm"
        );


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    );

                const newPassword =
                    document.getElementById(
                        "newPassword"
                    );

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    );


                const currentValue =
                    currentPassword
                        ? currentPassword.value
                        : "";


                const newValue =
                    newPassword
                        ? newPassword.value
                        : "";


                const confirmValue =
                    confirmPassword
                        ? confirmPassword.value
                        : "";


                /* =====================================
                   VALIDAÇÃO
                ====================================== */

                if (!currentValue) {

                    showNotification(
                        "Digite sua senha atual."
                    );

                    return;

                }


                if (
                    newValue.length < 8
                ) {

                    showNotification(
                        "A nova senha deve possuir pelo menos 8 caracteres."
                    );

                    return;

                }


                if (
                    newValue !==
                    confirmValue
                ) {

                    showNotification(
                        "As senhas não coincidem."
                    );

                    return;

                }


                /* =====================================
                   IMPORTANTE
                ======================================

                   A senha NÃO será salva no navegador.

                   A alteração real será feita
                   posteriormente através da API/backend.
                ====================================== */

                showNotification(
                    "A alteração de senha será concluída pelo servidor."
                );


                passwordForm.reset();

            }
        );

    }


    /* =====================================================
       MOSTRAR / OCULTAR SENHAS
    ====================================================== */

    const passwordToggles =
        document.querySelectorAll(
            "[data-toggle-password]"
        );


    passwordToggles.forEach(toggle => {

        toggle.addEventListener(
            "click",
            () => {

                const targetId =
                    toggle.dataset.togglePassword;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";

                    toggle.textContent =
                        "🙈";

                } else {

                    input.type =
                        "password";

                    toggle.textContent =
                        "👁️";

                }

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


                sessionStorage.removeItem(
                    "usuario"
                );


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
                3500
            );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    showSection("inicio");

});