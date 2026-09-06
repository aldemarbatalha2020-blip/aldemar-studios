/* =========================================================
   ALDEMAR STUDIOS — DASHBOARD.JS
   Versão atualizada
   Menu responsivo + funções do dashboard
========================================================= */


/* =========================================================
   CONFIGURAÇÃO DA API
========================================================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://aldemar-studios-api.onrender.com/api";


/* =========================================================
   ELEMENTOS PRINCIPAIS
========================================================= */

const menuItems = document.querySelectorAll(".menu-item[data-section]");
const contentSections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("pageTitle");


/* =========================================================
   ELEMENTOS DO USUÁRIO
========================================================= */

const userNameElement = document.getElementById("userName");
const welcomeNameElement = document.getElementById("welcomeName");
const userAvatarElement = document.getElementById("userAvatar");
const userPlanElement = document.getElementById("userPlan");

const profileAvatarElement = document.getElementById("profileAvatar");
const profileNameInput = document.getElementById("profileNameInput");
const profileNickInput = document.getElementById("profileNickInput");
const profileEmailInput = document.getElementById("profileEmailInput");

const profilePlanElement = document.getElementById("profilePlan");
const profilePlanBottomElement = document.getElementById("profilePlanBottom");

const profilePhotoInput = document.getElementById("profilePhotoInput");
const changeProfilePhotoButton = document.getElementById("changeProfilePhoto");
const removeProfilePhotoButton = document.getElementById("removeProfilePhoto");

const saveProfileButton = document.getElementById("saveProfileButton");
const cancelProfileEditButton = document.getElementById("cancelProfileEdit");

const changePasswordForm = document.getElementById("changePasswordForm");


/* =========================================================
   RECUPERAR USUÁRIO
========================================================= */

let usuario = null;

try {
    const usuarioSession = sessionStorage.getItem("usuario");

    if (usuarioSession) {
        usuario = JSON.parse(usuarioSession);
    }
} catch (error) {
    console.warn("Não foi possível ler o usuário da sessão:", error);
}

if (!usuario) {
    try {
        const usuarioLocal = localStorage.getItem("user");

        if (usuarioLocal) {
            usuario = JSON.parse(usuarioLocal);
        }
    } catch (error) {
        console.warn("Não foi possível ler o usuário local:", error);
    }
}

if (!usuario) {
    usuario = {
        id: null,
        nome: "Usuário",
        name: "Usuário",
        email: "",
        nick: "",
        plano: "Grátis",
        plan: "Grátis",
        foto: null,
        photo: null
    };
}


/* =========================================================
   FUNÇÕES DE DADOS DO USUÁRIO
========================================================= */

function getUserId() {
    return usuario?.id ||
           usuario?.userId ||
           usuario?._id ||
           null;
}


function getUserName() {
    return (
        usuario?.nome_completo ||
        usuario?.nome ||
        usuario?.name ||
        usuario?.fullName ||
        "Usuário"
    );
}


function getUserEmail() {
    return (
        usuario?.email ||
        usuario?.mail ||
        ""
    );
}


function getUserNick() {
    return (
        usuario?.nick ||
        usuario?.nickname ||
        usuario?.username ||
        ""
    );
}


function getUserPlan() {
    return (
        usuario?.plano ||
        usuario?.plan ||
        "Grátis"
    );
}


function firstName(name) {
    if (!name) return "Usuário";

    return name
        .trim()
        .split(/\s+/)[0];
}


function getInitials(name) {
    if (!name) return "U";

    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


function getCurrentPhoto() {
    return (
        usuario?.foto ||
        usuario?.photo ||
        usuario?.avatar ||
        usuario?.profilePhoto ||
        null
    );
}


/* =========================================================
   ATUALIZAR AVATAR
========================================================= */

function updateAvatarElement(element, photo, name) {
    if (!element) return;

    const initials = getInitials(name);

    if (photo) {
        element.style.backgroundImage = `url("${photo}")`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
        element.textContent = "";
    } else {
        element.style.backgroundImage = "none";
        element.textContent = initials;
    }
}


/* =========================================================
   ATUALIZAR INTERFACE
========================================================= */

function updateUserInterface() {
    const name = getUserName();
    const email = getUserEmail();
    const nick = getUserNick();
    const plan = getUserPlan();
    const photo = getCurrentPhoto();

    if (userNameElement) {
        userNameElement.textContent = name;
    }

    if (welcomeNameElement) {
        welcomeNameElement.textContent = firstName(name);
    }

    if (userPlanElement) {
        userPlanElement.textContent = plan;
    }

    if (profileNameInput) {
        profileNameInput.value = name;
    }

    if (profileNickInput) {
        profileNickInput.value = nick;
    }

    if (profileEmailInput) {
        profileEmailInput.value = email;
    }

    if (profilePlanElement) {
        profilePlanElement.textContent = plan;
    }

    if (profilePlanBottomElement) {
        profilePlanBottomElement.textContent = plan;
    }

    updateAvatarElement(
        userAvatarElement,
        photo,
        name
    );

    updateAvatarElement(
        profileAvatarElement,
        photo,
        name
    );
}


/* =========================================================
   SALVAR USUÁRIO LOCALMENTE
========================================================= */

function saveUser() {
    try {
        sessionStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );
    } catch (error) {
        console.warn(
            "Não foi possível salvar usuário na sessão:",
            error
        );
    }

    try {
        localStorage.setItem(
            "user",
            JSON.stringify(usuario)
        );
    } catch (error) {
        console.warn(
            "Não foi possível salvar usuário localmente:",
            error
        );
    }
}


/* =========================================================
   DADOS ORIGINAIS DO PERFIL
========================================================= */

let originalProfileData = null;

function saveOriginalProfileData() {
    originalProfileData = {
        name: getUserName(),
        nick: getUserNick(),
        email: getUserEmail()
    };
}


/* =========================================================
   NAVEGAÇÃO PRINCIPAL
========================================================= */

menuItems.forEach(item => {

    item.addEventListener("click", function(event) {

        event.preventDefault();

        const sectionName = this.dataset.section;

        if (!sectionName) return;


        /* ---------------------------------------------
           ITEM BLOQUEADO
        --------------------------------------------- */

        if (
            this.dataset.locked === "true" ||
            this.classList.contains("locked")
        ) {
            showNotification(
                "Este conteúdo está disponível apenas em planos superiores.",
                "warning"
            );

            closeMobileMenu();

            return;
        }


        /* ---------------------------------------------
           LOGOUT
        --------------------------------------------- */

        if (sectionName === "logout") {
            logout();
            return;
        }


        /* ---------------------------------------------
           CURSOS
        --------------------------------------------- */

        if (sectionName === "cursos") {
            openCourses();
            return;
        }


        /* ---------------------------------------------
           MINI CURSO DE INGLÊS
        --------------------------------------------- */

        if (sectionName === "ingles") {
            openMiniCursoIngles();
            return;
        }


        /* ---------------------------------------------
           NAVEGAÇÃO NORMAL
        --------------------------------------------- */

        showSection(sectionName);

        closeMobileMenu();

    });

});


/* =========================================================
   LINKS DE ACESSO ENTRE SEÇÕES
========================================================= */

document.querySelectorAll("[data-section-link]").forEach(element => {

    element.addEventListener("click", function(event) {

        event.preventDefault();

        const section = this.dataset.sectionLink;

        if (!section) return;

        showSection(section);

        closeMobileMenu();

    });

});


/* =========================================================
   BOTÕES COM DATA-SECTION
========================================================= */

document.querySelectorAll("button[data-section]").forEach(button => {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        const section = this.dataset.section;

        if (!section) return;

        if (
            this.dataset.locked === "true" ||
            this.classList.contains("locked")
        ) {
            showNotification(
                "Este conteúdo está disponível apenas em planos superiores.",
                "warning"
            );

            return;
        }

        showSection(section);

        closeMobileMenu();

    });

});


/* =========================================================
   ABRIR CURSOS
========================================================= */

function openCourses() {

    window.location.href = "cursos/index.html";

}


/* =========================================================
   ABRIR MINI CURSO DE INGLÊS
========================================================= */

function openMiniCursoIngles() {

    window.location.href = "/cursos/ingles-gratis/";

}


/* =========================================================
   ABRIR JOGOS DE INGLÊS
========================================================= */

function openEnglishGames() {

    const section = document.getElementById("jogos");

    if (section) {
        showSection("jogos");
    }

}


/* =========================================================
   MOSTRAR SEÇÃO
========================================================= */

function showSection(sectionName) {

    if (!sectionName) return;


    /* ---------------------------------------------
       ESCONDER TODAS
    --------------------------------------------- */

    contentSections.forEach(section => {
        section.classList.remove("active");
    });


    /* ---------------------------------------------
       MOSTRAR A ESCOLHIDA
    --------------------------------------------- */

    const targetSection =
        document.getElementById(sectionName);

    if (targetSection) {
        targetSection.classList.add("active");
    }


    /* ---------------------------------------------
       ATUALIZAR MENU
    --------------------------------------------- */

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.section === sectionName
        ) {
            item.classList.add("active");
        }

    });


    /* ---------------------------------------------
       ATUALIZAR TÍTULO
    --------------------------------------------- */

    updatePageTitle(sectionName);


    /* ---------------------------------------------
       VOLTAR AO TOPO
    --------------------------------------------- */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   TÍTULO DA PÁGINA
========================================================= */

function updatePageTitle(sectionName) {

    if (!pageTitle) return;

    const titles = {

        inicio: "Início",

        jogos: "Central de Jogos",

        ingles: "Inglês",

        musica: "Música",

        inclusivos: "Conteúdos Inclusivos",

        materiais: "Materiais",

        simulados: "Simulados",

        cursos: "Meus Cursos",

        planos: "Planos",

        feedback: "Feedback",

        perfil: "Meu Perfil"

    };

    pageTitle.textContent =
        titles[sectionName] || "Dashboard";

}


/* =========================================================
   CATEGORIAS DE JOGOS
========================================================= */

function openGameCategory(category) {

    document.querySelectorAll(".game-category").forEach(element => {
        element.classList.remove("active");
    });

    const target =
        document.getElementById(category);

    if (target) {
        target.classList.add("active");
    }

}


function backToGameCategories() {

    document.querySelectorAll(".game-category").forEach(element => {
        element.classList.remove("active");
    });

    const categories =
        document.getElementById("gameCategories");

    if (categories) {
        categories.classList.add("active");
    }

}


function filterGames(category) {

    const games =
        document.querySelectorAll("[data-game-category]");

    games.forEach(game => {

        if (
            category === "all" ||
            game.dataset.gameCategory === category
        ) {
            game.style.display = "";
        } else {
            game.style.display = "none";
        }

    });

}


/* =========================================================
   FOTO DE PERFIL
========================================================= */

let pendingProfilePhoto = null;


if (changeProfilePhotoButton && profilePhotoInput) {

    changeProfilePhotoButton.addEventListener(
        "click",
        function() {

            profilePhotoInput.click();

        }
    );

}


if (profilePhotoInput) {

    profilePhotoInput.addEventListener(
        "change",
        function() {

            const file = this.files?.[0];

            if (!file) return;


            /* -----------------------------------------
               FORMATOS
            ----------------------------------------- */

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                showNotification(
                    "Escolha uma imagem JPG, PNG ou WEBP.",
                    "error"
                );

                this.value = "";

                return;
            }


            /* -----------------------------------------
               TAMANHO
            ----------------------------------------- */

            const maxSize =
                5 * 1024 * 1024;

            if (file.size > maxSize) {

                showNotification(
                    "A imagem deve ter no máximo 5 MB.",
                    "error"
                );

                this.value = "";

                return;
            }


            /* -----------------------------------------
               LEITURA
            ----------------------------------------- */

            const reader = new FileReader();

            reader.onload = function(event) {

                pendingProfilePhoto =
                    event.target.result;

                updateAvatarElement(
                    profileAvatarElement,
                    pendingProfilePhoto,
                    getUserName()
                );

            };

            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   REMOVER FOTO
========================================================= */

if (removeProfilePhotoButton) {

    removeProfilePhotoButton.addEventListener(
        "click",
        function() {

            pendingProfilePhoto = "";

            updateAvatarElement(
                profileAvatarElement,
                null,
                getUserName()
            );

        }
    );

}


/* =========================================================
   SALVAR PERFIL
========================================================= */

if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        async function() {

            const name =
                profileNameInput?.value.trim() || "";

            const nick =
                profileNickInput?.value.trim() || "";

            const email =
                profileEmailInput?.value.trim() || "";


            /* -----------------------------------------
               VALIDAÇÃO DO NOME
            ----------------------------------------- */

            if (!name) {

                showNotification(
                    "Digite seu nome.",
                    "error"
                );

                return;
            }


            /* -----------------------------------------
               VALIDAÇÃO DO EMAIL
            ----------------------------------------- */

            if (
                email &&
                !isValidEmail(email)
            ) {

                showNotification(
                    "Digite um e-mail válido.",
                    "error"
                );

                return;
            }


            const originalText =
                saveProfileButton.textContent;

            saveProfileButton.disabled = true;

            saveProfileButton.textContent =
                "Salvando...";


            try {

                const userId = getUserId();


                /* -------------------------------------
                   ATUALIZAÇÃO LOCAL
                ------------------------------------- */

                usuario.nome = name;
                usuario.name = name;

                usuario.nick = nick;

                usuario.email = email;


                if (pendingProfilePhoto !== null) {

                    usuario.foto =
                        pendingProfilePhoto;

                    usuario.photo =
                        pendingProfilePhoto;
                }


                /* -------------------------------------
                   SERVIDOR
                ------------------------------------- */

                if (userId) {

                    const response =
                        await fetch(
                            `${API_URL}/auth/profile`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    userId,

                                    nome: name,

                                    name,

                                    nick,

                                    email,

                                    foto:
                                        pendingProfilePhoto !== null
                                            ? pendingProfilePhoto
                                            : getCurrentPhoto()

                                })
                            }
                        );


                    const data =
                        await parseResponse(response);


                    if (!response.ok) {

                        throw new Error(
                            data?.message ||
                            "Não foi possível atualizar o perfil."
                        );

                    }


                    if (data?.user) {

                        usuario = {
                            ...usuario,
                            ...data.user
                        };

                    }

                }


                /* -------------------------------------
                   SALVAR LOCALMENTE
                ------------------------------------- */

                saveUser();

                pendingProfilePhoto = null;

                updateUserInterface();

                saveOriginalProfileData();


                showNotification(
                    "Perfil atualizado com sucesso!",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Erro ao atualizar perfil:",
                    error
                );

                showNotification(
                    error.message ||
                    "Erro ao atualizar perfil.",
                    "error"
                );

            } finally {

                saveProfileButton.disabled = false;

                saveProfileButton.textContent =
                    originalText;

            }

        }
    );

}


/* =========================================================
   CANCELAR EDIÇÃO DO PERFIL
========================================================= */

if (cancelProfileEditButton) {

    cancelProfileEditButton.addEventListener(
        "click",
        function() {

            if (!originalProfileData) {
                saveOriginalProfileData();
            }

            if (profileNameInput) {
                profileNameInput.value =
                    originalProfileData.name;
            }

            if (profileNickInput) {
                profileNickInput.value =
                    originalProfileData.nick;
            }

            if (profileEmailInput) {
                profileEmailInput.value =
                    originalProfileData.email;
            }

            pendingProfilePhoto = null;

            updateAvatarElement(
                profileAvatarElement,
                getCurrentPhoto(),
                getUserName()
            );

        }
    );

}


/* =========================================================
   ALTERAR SENHA
========================================================= */

if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const formData =
                new FormData(changePasswordForm);

            const currentPassword =
                formData.get("currentPassword") ||
                formData.get("senhaAtual") ||
                "";

            const newPassword =
                formData.get("newPassword") ||
                formData.get("novaSenha") ||
                "";

            const confirmPassword =
                formData.get("confirmPassword") ||
                formData.get("confirmarSenha") ||
                "";


            if (!currentPassword || !newPassword) {

                showNotification(
                    "Preencha todos os campos.",
                    "error"
                );

                return;
            }


            if (newPassword.length < 6) {

                showNotification(
                    "A nova senha deve ter pelo menos 6 caracteres.",
                    "error"
                );

                return;
            }


            if (newPassword !== confirmPassword) {

                showNotification(
                    "As senhas não coincidem.",
                    "error"
                );

                return;
            }


            const submitButton =
                changePasswordForm.querySelector(
                    'button[type="submit"]'
                );

            const originalText =
                submitButton?.textContent;


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Alterando...";

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/password`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userId: getUserId(),

                                currentPassword,

                                newPassword

                            })
                        }
                    );


                const data =
                    await parseResponse(response);


                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        "Não foi possível alterar a senha."
                    );

                }


                showNotification(
                    "Senha alterada com sucesso!",
                    "success"
                );


                changePasswordForm.reset();


            } catch (error) {

                console.error(
                    "Erro ao alterar senha:",
                    error
                );

                showNotification(
                    error.message ||
                    "Erro ao alterar senha.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalText;

                }

            }

        }
    );

}


/* =========================================================
   VALIDAÇÃO DE EMAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================================================
   FEEDBACK — ESTRELAS
========================================================= */

const feedbackStars =
    document.querySelectorAll(
        ".feedback-star, .star"
    );

let selectedRating = 0;


feedbackStars.forEach((star, index) => {

    star.addEventListener(
        "click",
        function() {

            selectedRating =
                Number(
                    this.dataset.rating ||
                    index + 1
                );

            feedbackStars.forEach(
                (item, itemIndex) => {

                    const rating =
                        Number(
                            item.dataset.rating ||
                            itemIndex + 1
                        );

                    item.classList.toggle(
                        "active",
                        rating <= selectedRating
                    );

                }
            );

        }
    );

});


/* =========================================================
   BOTÃO DE FEEDBACK
========================================================= */

document.querySelectorAll(
    "#sendFeedbackButton, #feedbackButton, .feedback-button"
).forEach(button => {

    button.addEventListener(
        "click",
        function() {

            const textarea =
                document.querySelector(
                    "#feedbackText, textarea[name='feedback']"
                );

            const message =
                textarea?.value.trim() || "";


            if (!selectedRating) {

                showNotification(
                    "Selecione uma avaliação.",
                    "warning"
                );

                return;
            }


            if (!message) {

                showNotification(
                    "Escreva uma mensagem antes de enviar.",
                    "warning"
                );

                return;
            }


            showNotification(
                "Obrigado pelo seu feedback!",
                "success"
            );


            if (textarea) {
                textarea.value = "";
            }

        }
    );

});


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    try {
        sessionStorage.removeItem("usuario");
    } catch (error) {
        console.warn(error);
    }

    try {
        localStorage.removeItem("user");
    } catch (error) {
        console.warn(error);
    }


    window.location.href =
        "index.html";

}


/* =========================================================
   PROCESSAR RESPOSTA DA API
========================================================= */

async function parseResponse(response) {

    const contentType =
        response.headers.get("content-type") || "";


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        return await response.json();

    }


    const text =
        await response.text();


    return {
        message: text
    };

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function showNotification(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(
            ".dashboard-notification"
        );

    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        `dashboard-notification ${type}`;


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 3500);

}


/* =========================================================
   EVITAR SUBMIT ACIDENTAL
========================================================= */

document.querySelectorAll("form").forEach(form => {

    form.addEventListener(
        "submit",
        function(event) {

            if (
                form !== changePasswordForm &&
                !form.dataset.allowSubmit
            ) {
                event.preventDefault();
            }

        }
    );

});


/* =========================================================
   =========================================================
   RESPONSIVIDADE — MENU MOBILE / TABLET
   =========================================================
========================================================= */

const sidebar =
    document.querySelector(".sidebar");

const mobileButton =
    document.getElementById(
        "mobileMenuButton"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


/* ---------------------------------------------------------
   ABRIR MENU
--------------------------------------------------------- */

function openMobileMenu() {

    if (!sidebar) return;


    sidebar.classList.add(
        "mobile-open"
    );


    if (sidebarOverlay) {

        sidebarOverlay.hidden = false;

        requestAnimationFrame(() => {

            sidebarOverlay.classList.add(
                "show"
            );

        });

    }


    if (mobileButton) {

        mobileButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileButton.classList.add(
            "menu-active"
        );

    }


    document.body.classList.add(
        "mobile-menu-active"
    );


    /* Impede a página de rolar enquanto o menu está aberto */

    document.body.style.overflow =
        "hidden";

}


/* ---------------------------------------------------------
   FECHAR MENU
--------------------------------------------------------- */

function closeMobileMenu() {

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (
                !sidebarOverlay.classList.contains(
                    "show"
                )
            ) {

                sidebarOverlay.hidden =
                    true;

            }

        }, 250);

    }


    if (mobileButton) {

        mobileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileButton.classList.remove(
            "menu-active"
        );

    }


    document.body.classList.remove(
        "mobile-menu-active"
    );


    document.body.style.overflow =
        "";

}


/* ---------------------------------------------------------
   BOTÃO MOBILE
--------------------------------------------------------- */

if (mobileButton) {

    mobileButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                sidebar?.classList.contains(
                    "mobile-open"
                );


            if (isOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );

}


/* ---------------------------------------------------------
   OVERLAY
--------------------------------------------------------- */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        function() {

            closeMobileMenu();

        }
    );

}


/* ---------------------------------------------------------
   ESC FECHA O MENU
--------------------------------------------------------- */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" ||
            event.key === "Esc"
        ) {

            if (
                sidebar?.classList.contains(
                    "mobile-open"
                )
            ) {

                closeMobileMenu();

            }

        }

    }
);


/* ---------------------------------------------------------
   CLICAR EM ITEM DO MENU FECHA MENU
--------------------------------------------------------- */

menuItems.forEach(item => {

    item.addEventListener(
        "click",
        function() {

            if (
                window.innerWidth <= 1100
            ) {

                setTimeout(() => {

                    closeMobileMenu();

                }, 100);

            }

        }
    );

});


/* ---------------------------------------------------------
   REDIMENSIONAMENTO
--------------------------------------------------------- */

let previousWidth =
    window.innerWidth;


window.addEventListener(
    "resize",
    function() {

        const currentWidth =
            window.innerWidth;


        /*
         * Acima de 1100px:
         * volta para o modo desktop.
         */

        if (
            currentWidth > 1100 &&
            previousWidth <= 1100
        ) {

            closeMobileMenu();

        }


        previousWidth =
            currentWidth;

    }
);


/* =========================================================
   PROTEÇÃO DOS BOTÕES BLOQUEADOS
========================================================= */

document.querySelectorAll(
    "[data-locked='true']"
).forEach(button => {

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            showNotification(
                "Este recurso está disponível em um plano superior.",
                "warning"
            );

        }
    );

});


/* =========================================================
   CATEGORIAS DE JOGOS
========================================================= */

document.querySelectorAll(
    "[data-game-category-open]"
).forEach(button => {

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const category =
                this.dataset.gameCategoryOpen;

            if (category) {
                openGameCategory(category);
            }

        }
    );

});


document.querySelectorAll(
    "[data-game-category-back]"
).forEach(button => {

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            backToGameCategories();

        }
    );

});


/* =========================================================
   MINI CURSO — COMPATIBILIDADE
========================================================= */

window.openMiniCursoIngles =
    openMiniCursoIngles;

window.openCourses =
    openCourses;

window.openEnglishGames =
    openEnglishGames;

window.showSection =
    showSection;

window.openGameCategory =
    openGameCategory;

window.backToGameCategories =
    backToGameCategories;

window.filterGames =
    filterGames;

window.closeMobileMenu =
    closeMobileMenu;

window.openMobileMenu =
    openMobileMenu;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateUserInterface();

        saveOriginalProfileData();

        showSection("inicio");


        /* ---------------------------------------------
           AVATAR — ABRIR PERFIL
        --------------------------------------------- */

        if (userAvatarElement) {

            userAvatarElement.addEventListener(
                "click",
                function() {

                    showSection("perfil");

                    closeMobileMenu();

                }
            );

        }


        /* ---------------------------------------------
           GARANTIR ESTADO INICIAL DO MENU
        --------------------------------------------- */

        if (mobileButton) {

            mobileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (sidebarOverlay) {

            sidebarOverlay.hidden =
                true;

        }


        /* ---------------------------------------------
           SE ESTIVER NO DESKTOP
        --------------------------------------------- */

        if (window.innerWidth > 1100) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   FIM DO DASHBOARD.JS
========================================================= */

