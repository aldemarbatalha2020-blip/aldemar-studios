/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   VERSÃO COMPLETA — ONLINE + API + PERFIL + JOGOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO DA API
    ====================================================== */

    /*
     * DESENVOLVIMENTO:
     * http://localhost:3000
     *
     * PRODUÇÃO:
     * https://aldemarstudios.com
     *
     * O frontend publicado no GitHub Pages não deve
     * apontar diretamente para localhost.
     */

    const IS_LOCAL =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    const API_URL = IS_LOCAL
    ? "http://localhost:3000"
    : "https://aldemar-studios-api.onrender.com/api";


    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-section]"
        );

    const sections =
        document.querySelectorAll(
            ".content-section"
        );

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    /* =====================================================
       ELEMENTOS DO USUÁRIO
    ====================================================== */

    const userNameElement =
        document.getElementById(
            "userName"
        );

    const welcomeNameElement =
        document.getElementById(
            "welcomeName"
        );

    const userAvatarElement =
        document.getElementById(
            "userAvatar"
        );

    const userPlanElement =
        document.getElementById(
            "userPlan"
        );

    const profileAvatarElement =
        document.getElementById(
            "profileAvatar"
        );

    const profileNameInput =
        document.getElementById(
            "profileNameInput"
        );

    const profileNickInput =
        document.getElementById(
            "profileNickInput"
        );

    const profileEmailInput =
        document.getElementById(
            "profileEmailInput"
        );

    const profilePlanElement =
        document.getElementById(
            "profilePlan"
        );

    const profilePlanBottom =
        document.getElementById(
            "profilePlanBottom"
        );

    const profilePhotoInput =
        document.getElementById(
            "profilePhotoInput"
        );

    const changePhotoButton =
        document.getElementById(
            "changeProfilePhoto"
        );

    const removePhotoButton =
        document.getElementById(
            "removePhotoButton"
        );

    const saveProfileButton =
        document.getElementById(
            "saveProfileButton"
        );

    const cancelProfileButton =
        document.getElementById(
            "cancelProfileEdit"
        );

    const changePasswordButton =
        document.getElementById(
            "changePasswordButton"
        );


    /* =====================================================
       RECUPERAR USUÁRIO
    ====================================================== */

    let user = null;

    try {

        const savedUser =
            sessionStorage.getItem(
                "usuario"
            );

        if (savedUser) {

            user =
                JSON.parse(
                    savedUser
                );
        }

    } catch (error) {

        console.error(
            "Erro ao recuperar usuário da sessão:",
            error
        );

        sessionStorage.removeItem(
            "usuario"
        );
    }


    /* =====================================================
       FALLBACK LOCALSTORAGE
    ====================================================== */

    if (!user) {

        try {

            const localUser =
                localStorage.getItem(
                    "user"
                );

            if (localUser) {

                user =
                    JSON.parse(
                        localUser
                    );
            }

        } catch (error) {

            console.warn(
                "Dados antigos de usuário inválidos:",
                error
            );

            localStorage.removeItem(
                "user"
            );
        }
    }


    /* =====================================================
       FUNÇÕES DE USUÁRIO
    ====================================================== */

    function getUserId() {

        if (!user) {
            return null;
        }

        return (
            user.id ||
            user.usuario_id ||
            user.user_id ||
            null
        );
    }


    function getUserName() {

        if (!user) {
            return "Usuário";
        }

        return (
            user.nome_completo ||
            user.nome ||
            user.name ||
            user.fullName ||
            "Usuário"
        );
    }


    function getUserEmail() {

        if (!user) {
            return "";
        }

        return (
            user.email ||
            user.emailAddress ||
            ""
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
       ATUALIZAR AVATAR
    ====================================================== */

    function updateAvatarElement(
        element,
        initials
    ) {

        if (!element) {
            return;
        }


        if (
            user &&
            user.foto
        ) {

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

            element.style.backgroundSize =
                "";

            element.style.backgroundPosition =
                "";

            element.style.backgroundRepeat =
                "";

            element.textContent =
                initials;
        }
    }


    /* =====================================================
       ATUALIZAR INTERFACE
    ====================================================== */

    function updateUserInterface() {

        if (!user) {
            return;
        }


        const name =
            getUserName();

        const email =
            getUserEmail();

        const nick =
            getUserNick();

        const plan =
            getUserPlan();

        const initials =
            getInitials(name);


        /* HEADER */

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


        /* BOAS-VINDAS */

        if (welcomeNameElement) {

            welcomeNameElement.textContent =
                firstName(name);
        }


        /* PERFIL */

        if (profileNameInput) {

            profileNameInput.value =
                name;
        }


        if (profileNickInput) {

            profileNickInput.value =
                nick;
        }


        if (profileEmailInput) {

            profileEmailInput.value =
                email;
        }


        if (profilePlanElement) {

            profilePlanElement.textContent =
                String(plan).toUpperCase();
        }


        if (profilePlanBottom) {

            profilePlanBottom.textContent =
                String(plan).toUpperCase();
        }


        if (profileAvatarElement) {

            updateAvatarElement(
                profileAvatarElement,
                initials
            );
        }
    }


    /* =====================================================
       SALVAR USUÁRIO
    ====================================================== */

    function saveUser() {

        if (!user) {
            return;
        }


        try {

            sessionStorage.setItem(
                "usuario",
                JSON.stringify(user)
            );

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
       INICIALIZAÇÃO
    ====================================================== */

    updateUserInterface();


    /* =====================================================
       NAVEGAÇÃO DO MENU
    ====================================================== */

    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

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


                showSection(
                    sectionName
                );
            }
        );
    });


    /* =====================================================
       CARDS DE ACESSO
    ====================================================== */

    const accessCards =
        document.querySelectorAll(
            "[data-section-link]"
        );


    accessCards.forEach(card => {

        card.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest("button")
                ) {
                    return;
                }


                const section =
                    card.dataset.sectionLink;


                if (!section) {
                    return;
                }


                if (section === "cursos") {

                    openCourses();

                    return;
                }


                if (section === "jogos") {

                    showSection(
                        "jogos"
                    );

                    return;
                }


                showSection(
                    section
                );
            }
        );
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
       ABRIR JOGOS DE INGLÊS
    ====================================================== */

    window.openEnglishGames =
        function() {

            showSection(
                "jogos"
            );

            setTimeout(() => {

                openGameCategory(
                    "educativos"
                );

                setTimeout(() => {

                    const englishFilter =
                        document.querySelector(
                            '.game-filter[onclick*="ingles"]'
                        );

                    filterGames(
                        "ingles",
                        englishFilter
                    );

                }, 50);

            }, 50);
        };


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


            if (
                sectionName === "perfil"
            ) {

                updateUserInterface();
            }


            if (
                sectionName === "jogos"
            ) {

                backToGameCategories();
            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };


    /* =====================================================
       TÍTULOS
    ====================================================== */

    function updatePageTitle(
        sectionName
    ) {

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


            if (
                category === "educativos"
            ) {

                const allFilter =
                    document.querySelector(
                        '.game-filter[onclick*="todos"]'
                    );

                filterGames(
                    "todos",
                    allFilter
                );
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
       FILTRO DOS JOGOS
    ====================================================== */

    window.filterGames =
        function(
            filter,
            button
        ) {

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
       PERFIL — SALVAR ALTERAÇÕES
    ====================================================== */

    if (saveProfileButton) {

        saveProfileButton.addEventListener(
            "click",
            async () => {

                if (!user) {

                    showNotification(
                        "Usuário não encontrado."
                    );

                    return;
                }


                const newName =
                    profileNameInput
                        ? profileNameInput.value.trim()
                        : "";


                const newNick =
                    profileNickInput
                        ? profileNickInput.value.trim()
                        : "";


                const newEmail =
                    profileEmailInput
                        ? profileEmailInput.value
                            .trim()
                            .toLowerCase()
                        : "";


                if (!newName) {

                    showNotification(
                        "Digite seu nome completo."
                    );

                    profileNameInput?.focus();

                    return;
                }


                if (newName.length < 3) {

                    showNotification(
                        "O nome deve possuir pelo menos 3 caracteres."
                    );

                    profileNameInput?.focus();

                    return;
                }


                if (newNick.length > 30) {

                    showNotification(
                        "O nick deve possuir no máximo 30 caracteres."
                    );

                    profileNickInput?.focus();

                    return;
                }


                if (
                    newNick &&
                    (
                        newNick.length < 3 ||
                        !/^[a-zA-Z0-9_.-]+$/.test(
                            newNick
                        )
                    )
                ) {

                    showNotification(
                        "O nick deve possuir entre 3 e 30 caracteres e pode conter apenas letras, números, ponto, hífen e underline."
                    );

                    profileNickInput?.focus();

                    return;
                }


                if (!newEmail) {

                    showNotification(
                        "Digite seu e-mail."
                    );

                    profileEmailInput?.focus();

                    return;
                }


                if (
                    !isValidEmail(
                        newEmail
                    )
                ) {

                    showNotification(
                        "Digite um e-mail válido."
                    );

                    profileEmailInput?.focus();

                    return;
                }


                const originalText =
                    saveProfileButton.textContent;


                saveProfileButton.disabled =
                    true;

                saveProfileButton.textContent =
                    "SALVANDO...";


                try {

                    const data =
                        await updateProfileOnServer(
                            newName,
                            newNick,
                            newEmail
                        );


                    if (data.usuario) {

                        user = {
                            ...user,
                            ...data.usuario
                        };

                    } else {

                        user.nome_completo =
                            newName;

                        user.nick =
                            newNick;

                        user.email =
                            newEmail;
                    }


                    saveUser();

                    updateUserInterface();


                    showNotification(
                        data.mensagem ||
                        "Perfil atualizado com sucesso!"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao atualizar perfil:",
                        error
                    );


                    showNotification(
                        error.message ||
                        "Erro ao atualizar perfil."
                    );


                } finally {

                    saveProfileButton.disabled =
                        false;

                    saveProfileButton.textContent =
                        originalText;
                }
            }
        );
    }


    /* =====================================================
       CANCELAR ALTERAÇÕES
    ====================================================== */

    if (cancelProfileButton) {

        cancelProfileButton.addEventListener(
            "click",
            () => {

                updateUserInterface();

                showNotification(
                    "Alterações canceladas."
                );
            }
        );
    }


    /* =====================================================
       ATUALIZAR PERFIL NO SERVIDOR
    ====================================================== */

    async function updateProfileOnServer(
        nome_completo,
        nick,
        email,
        foto = undefined
    ) {

        const userId =
            getUserId();


        if (!userId) {

            throw new Error(
                "ID do usuário não encontrado."
            );
        }


        const body = {

            id:
                userId,

            nome_completo:
                nome_completo,

            nick:
                nick,

            email:
                email
        };


        if (foto !== undefined) {

            body.foto =
                foto;
        }


        const response =
            await fetch(
                `${API_URL}/auth/profile`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            body
                        )
                }
            );


        const data =
            await parseResponse(
                response
            );


        if (!response.ok) {

            throw new Error(
                data.mensagem ||
                data.message ||
                "Não foi possível atualizar o perfil."
            );
        }


        return data;
    }


    /* =====================================================
       FOTO — ALTERAR
    ====================================================== */

    if (
    changePhotoButton &&
    profilePhotoInput
) {

    changePhotoButton.onclick =
        function () {

            profilePhotoInput.click();

        };
}


    /* =====================================================
       FOTO — SELECIONAR
    ====================================================== */

    if (profilePhotoInput) {

        profilePhotoInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) {
                    return;
                }


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


                const maxSize =
                    5 * 1024 * 1024;


                if (
                    file.size > maxSize
                ) {

                    showNotification(
                        "A imagem deve ter no máximo 5 MB."
                    );

                    profilePhotoInput.value =
                        "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    async readerEvent => {

                        const photo =
                            readerEvent
                                .target
                                .result;


                        try {

                            showNotification(
                                "Enviando foto..."
                            );


                            const userId =
                                getUserId();


                            if (!userId) {

                                throw new Error(
                                    "ID do usuário não encontrado."
                                );

                            }


                            const response =
                                await fetch(
                                    `${API_URL}/usuarios/${userId}/foto`,
                                    {

                                        method: "PUT",

                                        headers: {

                                            "Content-Type":
                                                "application/json",

                                            "Accept":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({
                                                foto: photo
                                            })

                                    }
                                );


                            const data =
                                await parseResponse(
                                    response
                                );


                            if (!response.ok) {

                                throw new Error(
                                    data.mensagem ||
                                    data.message ||
                                    "Não foi possível atualizar a foto."
                                );

                            }

                            if (data.usuario) {

                                user = {
                                    ...user,
                                    ...data.usuario
                                };

                            } else {

                                user.foto =
                                    photo;
                            }


                            saveUser();

                            updateUserInterface();


                            showNotification(
                                data.mensagem ||
                                "Foto de perfil atualizada!"
                            );


                        } catch (error) {

                            console.error(
                                "Erro ao atualizar foto:",
                                error
                            );


                            showNotification(
                                error.message ||
                                "Erro ao atualizar foto."
                            );
                        }
                    };


                reader.readAsDataURL(
                    file
                );
            }
        );
    }


    /* =====================================================
       FOTO — REMOVER
    ====================================================== */

    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            async () => {

                if (!user) {

                    showNotification(
                        "Usuário não encontrado."
                    );

                    return;
                }


                if (!user.foto) {

                    showNotification(
                        "Você não possui uma foto de perfil."
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "Deseja realmente remover sua foto de perfil?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    showNotification(
                        "Removendo foto..."
                    );


                    const data =
                        await updateProfileOnServer(
                            getUserName(),
                            getUserNick(),
                            getUserEmail(),
                            null
                        );


                    if (data.usuario) {

                        user = {
                            ...user,
                            ...data.usuario
                        };

                    } else {

                        user.foto =
                            "";
                    }


                    saveUser();

                    updateUserInterface();


                    if (
                        profilePhotoInput
                    ) {

                        profilePhotoInput.value =
                            "";
                    }


                    showNotification(
                        data.mensagem ||
                        "Foto de perfil removida."
                    );


                } catch (error) {

                    console.error(
                        "Erro ao remover foto:",
                        error
                    );


                    showNotification(
                        error.message ||
                        "Erro ao remover foto."
                    );
                }
            }
        );
    }


    /* =====================================================
       ALTERAR SENHA
    ====================================================== */

    if (changePasswordButton) {

        changePasswordButton.addEventListener(
            "click",
            async () => {

                const userId =
                    getUserId();


                if (!userId) {

                    showNotification(
                        "Usuário não encontrado."
                    );

                    return;
                }


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


                if (!currentValue) {

                    showNotification(
                        "Digite sua senha atual."
                    );

                    currentPassword?.focus();

                    return;
                }


                if (
                    newValue.length < 8
                ) {

                    showNotification(
                        "A nova senha deve possuir pelo menos 8 caracteres."
                    );

                    newPassword?.focus();

                    return;
                }


                if (
                    newValue !==
                    confirmValue
                ) {

                    showNotification(
                        "As senhas não coincidem."
                    );

                    confirmPassword?.focus();

                    return;
                }


                const originalText =
                    changePasswordButton.textContent;


                changePasswordButton.disabled =
                    true;

                changePasswordButton.textContent =
                    "ALTERANDO...";


                try {

                    const response =
                        await fetch(
                         `${API_URL}/auth/password`,
                            {

                                method: "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        id:
                                            userId,

                                        senha_atual:
                                            currentValue,

                                        nova_senha:
                                            newValue
                                    })
                            }
                        );


                    const data =
                        await parseResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            data.mensagem ||
                            data.message ||
                            "Não foi possível alterar a senha."
                        );
                    }


                    if (
                        currentPassword
                    ) {

                        currentPassword.value =
                            "";
                    }


                    if (
                        newPassword
                    ) {

                        newPassword.value =
                            "";
                    }


                    if (
                        confirmPassword
                    ) {

                        confirmPassword.value =
                            "";
                    }


                    showNotification(
                        data.mensagem ||
                        "Senha alterada com sucesso!"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao alterar senha:",
                        error
                    );


                    showNotification(
                        error.message ||
                        "Erro ao alterar senha."
                    );


                } finally {

                    changePasswordButton.disabled =
                        false;

                    changePasswordButton.textContent =
                        originalText;
                }
            }
        );
    }


    /* =====================================================
       VALIDAR E-MAIL
    ====================================================== */

    function isValidEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =====================================================
       FEEDBACK — ESTRELAS
    ====================================================== */

    const stars =
        document.querySelectorAll(
            ".stars button"
        );


    stars.forEach(
        (star, index) => {

            star.addEventListener(
                "click",
                () => {

                    stars.forEach(
                        (
                            item,
                            starIndex
                        ) => {

                            if (
                                starIndex <=
                                index
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
        }
    );


    /* =====================================================
       FEEDBACK — ENVIAR
    ====================================================== */

    const feedbackButton =
        document.querySelector(
            "#feedback .primary-small"
        );


    const feedbackText =
        document.getElementById(
            "feedbackText"
        );


    if (feedbackButton) {

        feedbackButton.addEventListener(
            "click",
            () => {

                const text =
                    feedbackText
                        ? feedbackText.value.trim()
                        : "";


                const selectedStars =
                    document.querySelectorAll(
                        ".stars button.selected"
                    ).length;


                if (
                    selectedStars === 0
                ) {

                    showNotification(
                        "Escolha uma avaliação de 1 a 5 estrelas."
                    );

                    return;
                }


                if (!text) {

                    showNotification(
                        "Escreva sua sugestão antes de enviar."
                    );

                    feedbackText?.focus();

                    return;
                }


                showNotification(
                    "Obrigado pelo seu feedback!"
                );


                if (feedbackText) {

                    feedbackText.value =
                        "";
                }


                stars.forEach(
                    star => {

                        star.classList.remove(
                            "selected"
                        );
                    }
                );
            }
        );
    }


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
       PARSE DA RESPOSTA DA API
    ====================================================== */

    async function parseResponse(
        response
    ) {

        const text =
            await response.text();


        if (!text) {
            return {};
        }


        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.error(
                "Resposta inválida da API:",
                text
            );

            throw new Error(
                "O servidor retornou uma resposta inválida."
            );
        }
    }


    /* =====================================================
       NOTIFICAÇÃO
    ====================================================== */

    function showNotification(
        message
    ) {

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
       INICIALIZAÇÃO FINAL
    ====================================================== */

    showSection(
        "inicio"
    );

});




