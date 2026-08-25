/* =========================================================
   ALDEMAR STUDIOS
   DASHBOARD.JS
   VERSÃO COMPLETA ATUALIZADA
   =========================================================

   PRINCIPAIS FUNÇÕES:

   - Navegação do Dashboard
   - Cursos preservado
   - Inglês abre o Mini Curso
   - Central de Jogos
   - Jogos de Passatempo
   - Jogos Educativos
   - Filtro dos jogos educativos
   - Abertura dos jogos existentes
   - Perfil completo
   - Foto de perfil
   - Alteração de senha
   - Feedback
   - Logout
   - Menu mobile
   - Compatibilidade PC / tablet / celular

   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO DA API
    ====================================================== */

    const API_URL =
        `${window.location.origin}/api`;


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
       ESTADO DO USUÁRIO
    ====================================================== */

    let user = null;

    let pendingProfilePhoto =
        undefined;

    let originalProfileData =
        null;


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
       USUÁRIO PADRÃO
    ====================================================== */

    if (!user) {

        user = {

            nome_completo:
                "Usuário",

            nick:
                "",

            email:
                "",

            plano:
                "gratuito",

            foto:
                ""
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

        return (
            user?.nome_completo ||
            user?.nome ||
            user?.name ||
            user?.fullName ||
            "Usuário"
        );
    }


    function getUserEmail() {

        return (
            user?.email ||
            user?.emailAddress ||
            ""
        );
    }


    function getUserNick() {

        return (
            user?.nick ||
            user?.nickname ||
            ""
        );
    }


    function getUserPlan() {

        return (
            user?.plano ||
            user?.plan ||
            "gratuito"
        );
    }


    function getCurrentPhoto() {

        return (
            user?.foto ||
            user?.photo ||
            user?.foto_perfil ||
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
       ATUALIZAR AVATAR
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

            showNotification(
                "Não foi possível salvar os dados localmente."
            );
        }
    }


    /* =====================================================
       DADOS ORIGINAIS DO PERFIL
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
       INICIALIZAÇÃO DO USUÁRIO
    ====================================================== */

    updateUserInterface();

    saveOriginalProfileData();


    /* =====================================================
       NAVEGAÇÃO PRINCIPAL
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


                /* CURSOS */

                if (
                    sectionName ===
                    "cursos"
                ) {

                    openCourses();

                    return;
                }


                /* INGLÊS */

                if (
                    sectionName ===
                    "ingles"
                ) {

                    openMiniCursoIngles();

                    return;
                }


                showSection(
                    sectionName
                );
            }
        );
    });


    /* =====================================================
       CARDS DATA-SECTION-LINK
    ====================================================== */

    document
        .querySelectorAll(
            "[data-section-link]"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest("button")
                    ) {
                        return;
                    }

                    const section =
                        element.dataset.sectionLink;

                    if (!section) {
                        return;
                    }


                    if (
                        section ===
                        "cursos"
                    ) {

                        openCourses();

                        return;
                    }


                    if (
                        section ===
                        "ingles"
                    ) {

                        openMiniCursoIngles();

                        return;
                    }


                    showSection(section);
                }
            );
        });


    /* =====================================================
       BOTÕES DATA-SECTION-LINK
    ====================================================== */

    document
        .querySelectorAll(
            "button[data-section-link]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const section =
                        button.dataset.sectionLink;

                    if (!section) {
                        return;
                    }


                    if (
                        section ===
                        "cursos"
                    ) {

                        openCourses();

                        return;
                    }


                    if (
                        section ===
                        "ingles"
                    ) {

                        openMiniCursoIngles();

                        return;
                    }


                    showSection(section);
                }
            );
        });


    /* =====================================================
       CURSOS
       NÃO ALTERAR
    ====================================================== */

    function openCourses() {

        window.location.href =
            "cursos/index.html";
    }

    window.openCourses =
        openCourses;


    /* =====================================================
       MINI CURSO DE INGLÊS
    ====================================================== */

    function openMiniCursoIngles() {

        window.location.href =
            "/cursos/ingles-gratis/";
    }

    window.openMiniCursoIngles =
        openMiniCursoIngles;


    /* =====================================================
       ELEMENTOS DO MINI CURSO
    ====================================================== */

    document
        .querySelectorAll(
            '[data-content-category="mini-curso-ingles"]'
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    openMiniCursoIngles();
                }
            );
        });


    /* =====================================================
       MOSTRAR SEÇÃO
    ====================================================== */

    window.showSection =
        function(sectionName) {

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


            if (
                sectionName ===
                "perfil"
            ) {

                updateUserInterface();

                saveOriginalProfileData();
            }


            if (
                sectionName ===
                "jogos"
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
                "Mini Curso de Inglês",

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
       CENTRAL DE JOGOS
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
                category ===
                "educativos"
            ) {

                const allFilter =
                    document.querySelector(
                        '#educativosArea .game-filter[data-game-filter="todos"], #educativosArea .game-filter[onclick*="todos"]'
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
       FILTRO DOS JOGOS EDUCATIVOS
    ====================================================== */

    window.filterGames =
        function(
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
       ABRIR JOGOS DE INGLÊS
       APENAS CAMINHOS QUE EXISTEM
    ====================================================== */

    const englishGamePaths = {

        writer:
            "/jogos/educativos/ingles/english-writer/index.html",

        detective:
            "/jogos/educativos/ingles/ENGLISH%20DETECTIVE/index.html",

        runner:
            "/jogos/educativos/ingles/ENGLISH%20RUNNER/index.html",

        infantil:
            "/jogos/educativos/ingles/EDUCATIVO%20INFANTIL/index.html",

        interpretacao:
            "/jogos/educativos/ingles/INTERPRETA%C3%87%C3%83O%20TEXTUAL%20ENGLISH/index.html",

        dama:
            "/jogos/educativos/ingles/JOGO%20DA%20DAMA%20INGL%C3%8AS/index.html",

        forca:
            "/jogos/educativos/ingles/JOGO%20DA%20FORCA%20INGL%C3%8AS/index.html",

        interpretacaoEnglish:
            "/jogos/educativos/ingles/JOGO%20DA%20INTERPRETA%C3%87%C3%83O%20ENGLISH/index.html",

        memoria:
            "/jogos/educativos/ingles/JOGO%20DA%20MEM%C3%93RIA%20EM%20INGL%C3%8AS/index.html",

        perguntas:
            "/jogos/educativos/ingles/JOGO%20DAS%20PERGUNTAS%20EM%20INGL%C3%8AS/index.html",

        acao:
            "/jogos/educativos/ingles/JOGO%20DE%20A%C3%87%C3%83O%20ENGLISH/index.html",

        corrida:
            "/jogos/educativos/ingles/JOGO%20DE%20CORRIDA%20INGL%C3%8AS/index.html",

        puzzle:
            "/jogos/educativos/ingles/JOGO%20DE%20PUZZLE/index.html",

        quatroPessoas:
            "/jogos/educativos/ingles/JOGO%20DE%20QUATRO%20PESSOAS%20A%C3%87%C3%83O/index.html",

        alien:
            "/jogos/educativos/ingles/JOGO%20DO%20ALIEN/index.html",

        restaurante:
            "/jogos/educativos/ingles/JOGO%20DO%20RESTAURANTE%20EM%20INGL%C3%8AS/index.html",

        nonoAno:
            "/jogos/educativos/ingles/JOGOS%209%20ANO%20ATUALIZADOS/index.html",

        portugues:
            "/jogos/educativos/ingles/JOGOS%20L%C3%8DNGUA%20PORTUGUESA/index.html",

        quizA1:
            "/jogos/educativos/ingles/QUIZ%20N%C3%8DVEL%20B%C3%81SICO%20A1%20EM%20GRUPO/index.html",

        sons:
            "/jogos/educativos/ingles/SONS%20DAS%20PALAVRAS%20EM%20INGL%C3%8AS/index.html"
    };


    /* =====================================================
   ABERTURA DOS JOGOS EDUCATIVOS
====================================================== */

document.addEventListener("click", function (event) {

    const botao =
        event.target.closest(".game-play-button");

    if (!botao) {
        return;
    }

    const url =
        botao.dataset.gameUrl;

    if (!url) {
        console.warn(
            "Jogo sem caminho definido."
        );
        return;
    }

    window.location.href = url;
});


/* =====================================================
   CLIQUE NO CARD
====================================================== */

document.addEventListener("click", function (event) {

    const card =
        event.target.closest(".educational-game");

    if (!card) {
        return;
    }

    if (
        event.target.closest("button")
    ) {
        return;
    }

    const botao =
        card.querySelector(
            ".game-play-button"
        );

    if (botao) {
        botao.click();
    }

});
/* =====================================================
       JOGOS DE PASSATEMPO
    ====================================================== */

    document
        .querySelectorAll(
            '[data-game-category="passatempo"]'
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    window.location.href =
                        "jogos/passatempo/index.html";
                }
            );
        });

	/* =====================================================
   JOGOS EDUCATIVOS — ABRIR CENTRAL DE SELEÇÃO
====================================================== */

document
    .querySelectorAll(
        '[data-game-category="educativos"]'
    )
    .forEach(element => {

        element.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                window.openGameCategory("educativos");
            }
        );
    });


    
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
                    file.size >
                    maxSize
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


                        pendingProfilePhoto =
                            photo;


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
    ====================================================== */

    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            () => {

                const currentPhoto =
                    getCurrentPhoto();


                if (
                    !currentPhoto &&
                    pendingProfilePhoto ===
                    undefined
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
       PERFIL — SALVAR
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


                if (
                    newName.length <
                    3
                ) {

                    showNotification(
                        "O nome deve possuir pelo menos 3 caracteres."
                    );

                    profileNameInput?.focus();

                    return;
                }


                if (
                    newNick.length >
                    30
                ) {

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


                    saveUser();


                    pendingProfilePhoto =
                        undefined;


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


        if (
            foto !== undefined
        ) {

            body.foto =
                foto;
        }


        const response =
            await fetch(
                `${API_URL}/auth/profile`,
                {

                    method:
                        "PUT",

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
                    newValue.length <
                    8
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

                                method:
                                    "PUT",

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
       FEEDBACK
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

                            item.classList.toggle(
                                "selected",
                                starIndex <= index
                            );
                        }
                    );
                }
            );
        }
    );


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
       PARSE DA API
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


        notification.classList.remove(
            "show"
        );


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
       FORMULÁRIO DO PERFIL
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
       MENU MOBILE
    ====================================================== */

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    const mobileButton =
        document.getElementById(
            "mobileMenuButton"
        );

    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay"
        );


    function openMobileMenu() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add(
            "mobile-open"
        );


        if (sidebarOverlay) {

            sidebarOverlay.hidden =
                false;

            sidebarOverlay.classList.add(
                "show"
            );
        }


        if (mobileButton) {

            mobileButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function closeMobileMenu() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.remove(
            "mobile-open"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "show"
            );

            sidebarOverlay.hidden =
                true;
        }


        if (mobileButton) {

            mobileButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    if (mobileButton) {

        mobileButton.addEventListener(
            "click",
            () => {

                if (
                    sidebar &&
                    sidebar.classList.contains(
                        "mobile-open"
                    )
                ) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();
                }
            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeMobileMenu
        );
    }


    menuItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <=
                    900
                ) {

                    closeMobileMenu();
                }
            }
        );
    });


    /* =====================================================
       ESC FECHA MENU
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       REDIMENSIONAMENTO
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900 &&
                sidebar
            ) {

                closeMobileMenu();
            }
        }
    );


    /* =====================================================
       ÁREAS BLOQUEADAS
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
       CLICAR NO AVATAR → PERFIL
    ====================================================== */

    if (userAvatarElement) {

        userAvatarElement.addEventListener(
            "click",
            () => {

                const profileButton =
                    document.querySelector(
                        '[data-section="perfil"]'
                    );


                if (profileButton) {

                    profileButton.click();
                }
            }
        );
    }


    /* =====================================================
       INICIALIZAÇÃO FINAL
    ====================================================== */

    showSection("inicio");

});


/* =====================================================
   ALDEMAR STUDIOS — ABERTURA DOS JOGOS EDUCATIVOS
====================================================== */

document.addEventListener("click", function (event) {

    const botao =
        event.target.closest(".game-play-button");

    if (!botao) {
        return;
    }

    const url =
        botao.dataset.gameUrl;

    if (url) {
        window.location.href = url;
    }

});

document.addEventListener("click", function (event) {

    const card =
        event.target.closest(".educational-game");

    if (!card) {
        return;
    }

    if (event.target.closest("button")) {
        return;
    }

    const botao =
        card.querySelector(".game-play-button");

    if (botao) {
        botao.click();
    }

});

