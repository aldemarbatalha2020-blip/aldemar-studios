/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   VERSÃO ATUALIZADA
   =========================================================
   PRINCIPAIS MELHORIAS:
   - Navegação completa das áreas disponíveis
   - Materiais, Simulados e Premium continuam bloqueados
   - Perfil com salvamento completo
   - Foto de perfil salva SOMENTE ao clicar em SALVAR
   - Foto permanece após recarregar a página
   - Foto sincronizada com API + armazenamento local
   - Compatibilidade com celular, tablet e PC
   - Navegação interna com botão VOLTAR
   - Filtros de jogos
   - Feedback
   - Alteração de senha
   - Logout
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO DA API
    ====================================================== */

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

    const userPlanElement =
        document.getElementById("userPlan");

    const profileAvatarElement =
        document.getElementById("profileAvatar");

    const profileNameInput =
        document.getElementById("profileNameInput");

    const profileNickInput =
        document.getElementById("profileNickInput");

    const profileEmailInput =
        document.getElementById("profileEmailInput");

    const profilePlanElement =
        document.getElementById("profilePlan");

    const profilePlanBottom =
        document.getElementById("profilePlanBottom");

    const profilePhotoInput =
        document.getElementById("profilePhotoInput");

    const changePhotoButton =
        document.getElementById("changeProfilePhoto");

    const removePhotoButton =
        document.getElementById("removeProfilePhoto");

    const saveProfileButton =
        document.getElementById("saveProfileButton");

    const cancelProfileButton =
        document.getElementById("cancelProfileEdit");

    const changePasswordForm =
        document.getElementById("changePasswordForm");


    /* =====================================================
       ESTADO DO PERFIL
    ====================================================== */

    let user = null;

    /*
     * A foto escolhida fica temporariamente aqui.
     *
     * IMPORTANTE:
     * A foto NÃO é enviada imediatamente.
     *
     * O usuário escolhe a foto → visualiza a prévia →
     * clica em SALVAR ALTERAÇÕES → somente então a foto
     * é enviada para o servidor.
     */

    let pendingProfilePhoto = undefined;

    /*
     * undefined = nenhuma alteração feita
     * string      = nova foto
     * null        = remover foto
     */

    let originalProfileData = null;


    /* =====================================================
       RECUPERAR USUÁRIO
    ====================================================== */

    try {

        const savedUser =
            sessionStorage.getItem("usuario");

        if (savedUser) {

            user = JSON.parse(savedUser);
        }

    } catch (error) {

        console.error(
            "Erro ao recuperar usuário da sessão:",
            error
        );

        sessionStorage.removeItem("usuario");
    }


    /* =====================================================
       FALLBACK LOCALSTORAGE
    ====================================================== */

    if (!user) {

        try {

            const localUser =
                localStorage.getItem("user");

            if (localUser) {

                user = JSON.parse(localUser);
            }

        } catch (error) {

            console.warn(
                "Dados antigos de usuário inválidos:",
                error
            );

            localStorage.removeItem("user");
        }
    }


    /* =====================================================
       GARANTIR OBJETO DE USUÁRIO
    ====================================================== */

    if (!user) {

        user = {
            nome_completo: "Usuário",
            nick: "",
            email: "",
            plano: "gratuito",
            foto: ""
        };
    }


    /* =====================================================
       FUNÇÕES DO USUÁRIO
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
       OBTER FOTO ATUAL
    ====================================================== */

    function getCurrentPhoto() {

        if (!user) {
            return "";
        }

        return (
            user.foto ||
            user.photo ||
            user.foto_perfil ||
            ""
        );
    }


    /* =====================================================
       ATUALIZAR UM AVATAR
    ====================================================== */

    function updateAvatarElement(
        element,
        initials,
        photo = ""
    ) {

        if (!element) {
            return;
        }

        if (photo) {

            element.style.backgroundImage =
                `url("${photo}")`;

            element.style.backgroundSize =
                "cover";

            element.style.backgroundPosition =
                "center";

            element.style.backgroundRepeat =
                "no-repeat";

            element.textContent = "";

        } else {

            element.style.backgroundImage = "";

            element.style.backgroundSize = "";

            element.style.backgroundPosition = "";

            element.style.backgroundRepeat = "";

            element.textContent = initials;
        }
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

        const nick =
            getUserNick();

        const plan =
            getUserPlan();

        const photo =
            getCurrentPhoto();

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


        updateAvatarElement(
            userAvatarElement,
            initials,
            photo
        );


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


        updateAvatarElement(
            profileAvatarElement,
            initials,
            photo
        );
    }


    /* =====================================================
       SALVAR USUÁRIO LOCALMENTE
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

            showNotification(
                "Não foi possível salvar os dados localmente."
            );
        }
    }


    /* =====================================================
       CRIAR CÓPIA DOS DADOS ORIGINAIS
    ====================================================== */

    function saveOriginalProfileData() {

        originalProfileData = {

            nome_completo:
                getUserName(),

            nick:
                getUserNick(),

            email:
                getUserEmail(),

            foto:
                getCurrentPhoto()
        };

        pendingProfilePhoto =
            undefined;
    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    updateUserInterface();

    saveOriginalProfileData();


    /* =====================================================
       NAVEGAÇÃO DO MENU
    ====================================================== */

    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const locked =
                    item.dataset.locked === "true";


                /*
                 * SOMENTE as áreas marcadas como locked
                 * permanecem bloqueadas.
                 */

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
            }
        );
    });


    /* =====================================================
       CARDS COM DATA-SECTION-LINK
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


                showSection(section);
            }
        );
    });


    /* =====================================================
       BOTÕES INTERNOS DATA-SECTION-LINK
    ====================================================== */

    document
        .querySelectorAll(
            "button[data-section-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const section =
                        button.dataset.sectionLink;

                    if (!section) {
                        return;
                    }

                    if (section === "cursos") {

                        openCourses();

                        return;
                    }

                    showSection(section);
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
        function () {

            showSection("jogos");

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
        function (sectionName) {

            if (!sectionName) {
                return;
            }


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


            if (sectionName === "perfil") {

                updateUserInterface();

                saveOriginalProfileData();
            }


            if (sectionName === "jogos") {

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

    function updatePageTitle(sectionName) {

        if (!pageTitle) {
            return;
        }

        const titles = {

            inicio: "Início",

            jogos: "Jogos",

            ingles: "Inglês",

            musica: "Música",

            inclusivos: "Inclusivos",

            cursos: "Cursos",

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

    window.openGameCategory =
        function (category) {

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
        function () {

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
        function (
            filter,
            button
        ) {

            const games =
                document.querySelectorAll(
                    "#educativosArea .educational-game"
                );

            const filters =
                document.querySelectorAll(
                    "#educativosArea .game-filter"
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
       PERFIL — ALTERAR FOTO
    ====================================================== */

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
       PERFIL — SELECIONAR FOTO
       NÃO ENVIA PARA A API AQUI
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


                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showNotification(
                        "Selecione uma imagem JPG, PNG ou WEBP."
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
                    readerEvent => {

                        const photo =
                            readerEvent
                                .target
                                .result;


                        /*
                         * Guarda a foto somente como
                         * alteração pendente.
                         */

                        pendingProfilePhoto =
                            photo;


                        /*
                         * Mostra a prévia imediatamente.
                         */

                        const initials =
                            getInitials(
                                getUserName()
                            );


                        updateAvatarElement(
                            profileAvatarElement,
                            initials,
                            photo
                        );


                        updateAvatarElement(
                            userAvatarElement,
                            initials,
                            photo
                        );


                        showNotification(
                            "Foto selecionada. Clique em SALVAR ALTERAÇÕES para confirmar."
                        );
                    };


                reader.readAsDataURL(file);
            }
        );
    }


    /* =====================================================
       PERFIL — REMOVER FOTO
       TAMBÉM FICA PENDENTE ATÉ SALVAR
    ====================================================== */

    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            () => {

                const currentPhoto =
                    getCurrentPhoto();


                if (
                    !currentPhoto &&
                    pendingProfilePhoto === undefined
                ) {

                    showNotification(
                        "Você não possui uma foto de perfil."
                    );

                    return;
                }


                pendingProfilePhoto =
                    null;


                const initials =
                    getInitials(
                        getUserName()
                    );


                updateAvatarElement(
                    profileAvatarElement,
                    initials,
                    ""
                );


                updateAvatarElement(
                    userAvatarElement,
                    initials,
                    ""
                );


                if (profilePhotoInput) {

                    profilePhotoInput.value =
                        "";
                }


                showNotification(
                    "Remoção marcada. Clique em SALVAR ALTERAÇÕES para confirmar."
                );
            }
        );
    }


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


                /* VALIDAR NOME */

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


                /* VALIDAR NICK */

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


                /* VALIDAR E-MAIL */

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

                    /*
                     * Envia TODOS os dados de uma vez.
                     *
                     * Se pendingProfilePhoto for:
                     *
                     * undefined → foto não foi alterada
                     * string    → nova foto
                     * null      → remover foto
                     */

                    const data =
                        await updateProfileOnServer(
                            newName,
                            newNick,
                            newEmail,
                            pendingProfilePhoto
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


                        if (
                            pendingProfilePhoto !==
                            undefined
                        ) {

                            user.foto =
                                pendingProfilePhoto;
                        }
                    }


                    /*
                     * SALVA A INFORMAÇÃO LOCALMENTE.
                     *
                     * Isso permite que a foto continue
                     * aparecendo depois de recarregar.
                     */

                    saveUser();


                    /*
                     * Limpa a alteração pendente.
                     */

                    pendingProfilePhoto =
                        undefined;


                    /*
                     * Atualiza toda a interface.
                     */

                    updateUserInterface();

                    saveOriginalProfileData();


                    showNotification(
                        data.mensagem ||
                        "Perfil atualizado com sucesso!"
                    );


                } catch (error) {

                    console.error(
                        "Erro ao atualizar perfil:",
                        error
                    );


                    /*
                     * IMPORTANTE:
                     * Se a API estiver indisponível,
                     * não apagamos a foto escolhida.
                     */

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


        /*
         * SOMENTE adiciona foto quando ela
         * realmente foi alterada.
         */

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
                        JSON.stringify(body)
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
       CANCELAR ALTERAÇÕES
    ====================================================== */

    if (cancelProfileButton) {

        cancelProfileButton.addEventListener(
            "click",
            () => {

                if (
                    originalProfileData
                ) {

                    if (profileNameInput) {

                        profileNameInput.value =
                            originalProfileData.nome_completo;
                    }


                    if (profileNickInput) {

                        profileNickInput.value =
                            originalProfileData.nick;
                    }


                    if (profileEmailInput) {

                        profileEmailInput.value =
                            originalProfileData.email;
                    }


                    const initials =
                        getInitials(
                            originalProfileData.nome_completo
                        );


                    updateAvatarElement(
                        profileAvatarElement,
                        initials,
                        originalProfileData.foto
                    );


                    updateAvatarElement(
                        userAvatarElement,
                        initials,
                        originalProfileData.foto
                    );
                }


                pendingProfilePhoto =
                    undefined;


                if (profilePhotoInput) {

                    profilePhotoInput.value =
                        "";
                }


                showNotification(
                    "Alterações canceladas."
                );
            }
        );
    }


    /* =====================================================
       ALTERAR SENHA
    ====================================================== */

    if (changePasswordForm) {

        changePasswordForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


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


                const submitButton =
                    changePasswordForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "ALTERANDO...";
                }


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


                    if (currentPassword) {

                        currentPassword.value =
                            "";
                    }


                    if (newPassword) {

                        newPassword.value =
                            "";
                    }


                    if (confirmPassword) {

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

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;
                    }
                }
            }
        );
    }


    /* =====================================================
       VALIDAR E-MAIL
    ====================================================== */

    function isValidEmail(email) {

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

    async function parseResponse(response) {

        const text =
            await response.text();


        if (!text) {
            return {};
        }


        try {

            return JSON.parse(text);

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


        notification.classList.remove(
            "show"
        );


        /*
         * Força uma pequena atualização para
         * permitir que a animação seja repetida.
         */

        void notification.offsetWidth;


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
       PREVENIR ENVIO ACIDENTAL DOS FORMULÁRIOS
    ====================================================== */

    const profileEditForm =
        document.getElementById(
            "profileEditForm"
        );


    if (profileEditForm) {

        profileEditForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                if (saveProfileButton) {

                    saveProfileButton.click();
                }
            }
        );
    }


    /* =====================================================
       RESPONSIVIDADE — MENU MOBILE
    ====================================================== */

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    /*
     * Cria automaticamente um botão de menu
     * caso o CSS utilize a classe mobile-menu-button.
     */

    if (
        sidebar &&
        !document.getElementById(
            "mobileMenuButton"
        )
    ) {

        const mobileButton =
            document.createElement(
                "button"
            );


        mobileButton.type =
            "button";


        mobileButton.id =
            "mobileMenuButton";


        mobileButton.className =
            "mobile-menu-button";


        mobileButton.setAttribute(
            "aria-label",
            "Abrir menu"
        );


        mobileButton.innerHTML =
            "☰";


        document.body.appendChild(
            mobileButton
        );


        mobileButton.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "mobile-open"
                );
            }
        );


        /*
         * Fecha o menu ao selecionar uma seção
         * em dispositivos menores.
         */

        menuItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <=
                        900
                    ) {

                        sidebar.classList.remove(
                            "mobile-open"
                        );
                    }
                }
            );
        });
    }


    /* =====================================================
       FECHAR MENU COM ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );
            }
        }
    );


    /* =====================================================
       AJUSTE DE ORIENTAÇÃO / REDIMENSIONAMENTO
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
             * Em telas grandes, garante que o menu
             * mobile não permaneça aberto.
             */

            if (
                window.innerWidth > 900 &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );
            }
        }
    );


    /* =====================================================
       GARANTIR QUE BOTÕES DE DESENVOLVIMENTO
       CONTINUEM BLOQUEADOS
    ====================================================== */

    document
        .querySelectorAll(
            ".menu-item[data-locked='true']"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    showNotification(
                        "Esta área ainda está em desenvolvimento."
                    );
                }
            );
        });
/* =====================================================
   NAVEGAÇÃO — CENTRAL DE JOGOS
====================================================== */

/*
 * =====================================================
 * JOGOS DE PASSATEMPO
 * =====================================================
 *
 * O botão/card de Passatempo leva diretamente para:
 *
 * jogos/passatempo/index.html
 *
 * Essa página será responsável por apresentar
 * os 10 jogos de passatempo.
 */

document
    .querySelectorAll(
        '[data-game-category="passatempo"]'
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    window.location.href =
                        "jogos/passatempo/index.html";

                }
            );

        }
    );


/*
 * =====================================================
 * JOGOS EDUCATIVOS
 * =====================================================
 *
 * O destino já fica preparado mesmo que a página
 * ainda não exista.
 *
 * Futuramente:
 *
 * jogos/educativos/index.html
 */

document
    .querySelectorAll(
        '[data-game-category="educativos"]'
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    window.location.href =
                        "jogos/educativos/index.html";

                }
            );

        }
    );

    /* =====================================================
       INICIALIZAÇÃO FINAL
    ====================================================== */

    showSection("inicio");

});