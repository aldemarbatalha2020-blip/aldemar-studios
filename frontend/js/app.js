// =====================================================
// ALDEMAR STUDIOS
// APLICAÇÃO PRINCIPAL
// =====================================================


// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================

const API_URL = "/api";


// =====================================================
// TELAS
// =====================================================

const loginScreen =
    document.getElementById("loginScreen");

const registerScreen =
    document.getElementById("registerScreen");


// =====================================================
// BOTÕES
// =====================================================

const openRegister =
    document.getElementById("openRegister");

const backToLogin =
    document.getElementById("backToLogin");

const forgotPassword =
    document.getElementById("forgotPassword");


// =====================================================
// FORMULÁRIOS
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


// =====================================================
// VERIFICAÇÃO DOS ELEMENTOS
// =====================================================

console.log(
    "Aldemar Studios carregado."
);

console.log(
    "API:",
    API_URL
);


// =====================================================
// ABRIR CADASTRO
// =====================================================

if (openRegister) {

    openRegister.addEventListener(
        "click",
        () => {

            if (loginScreen) {

                loginScreen.classList.remove(
                    "active"
                );

            }

            if (registerScreen) {

                registerScreen.classList.add(
                    "active"
                );

            }

        }
    );

}


// =====================================================
// VOLTAR PARA LOGIN
// =====================================================

if (backToLogin) {

    backToLogin.addEventListener(
        "click",
        () => {

            if (registerScreen) {

                registerScreen.classList.remove(
                    "active"
                );

            }

            if (loginScreen) {

                loginScreen.classList.add(
                    "active"
                );

            }

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const senha =
                document
                    .getElementById("loginPassword")
                    .value;


            if (!email || !senha) {

                alert(
                    "Preencha o e-mail e a senha."
                );

                return;

            }


            try {

                console.log(
                    "Tentando realizar login..."
                );


                const resposta =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    senha
                                })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "Resposta do login:",
                    dados
                );


                // =====================================
                // ERRO
                // =====================================

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "E-mail ou senha incorretos."
                    );

                    return;

                }


                // =====================================
                // USUÁRIO AUTENTICADO
                // =====================================

                if (!dados.usuario) {

                    alert(
                        "Login realizado, mas os dados do usuário não foram recebidos."
                    );

                    return;

                }


                // =====================================
                // SALVAR SESSÃO
                // =====================================

                sessionStorage.setItem(
                    "usuario",
                    JSON.stringify({

                        ...dados.usuario,

                        token:
                            dados.token

                    })
                );


                console.log(
                    "Usuário autenticado:",
                    dados.usuario
                );


                // =====================================
                // MENSAGEM
                // =====================================

                alert(
                    `Bem-vindo, ${dados.usuario.nome_completo}!`
                );


                // =====================================
                // IR PARA O DASHBOARD
                // =====================================

                window.location.href =
                    "/dashboard.html";


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                alert(
                    "Não foi possível conectar ao servidor. Verifique sua conexão."
                );

            }

        }
    );

}


// =====================================================
// CADASTRO
// =====================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const nome_completo =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const senha =
                document
                    .getElementById("registerPassword")
                    .value;


            // =====================================
            // VALIDAÇÕES
            // =====================================

            if (!nome_completo) {

                alert(
                    "Digite seu nome completo."
                );

                return;

            }


            if (!email) {

                alert(
                    "Digite seu e-mail."
                );

                return;

            }


            if (senha.length < 8) {

                alert(
                    "A senha deve possuir pelo menos 8 caracteres."
                );

                return;

            }


            try {

                console.log(
                    "Criando conta..."
                );


                const resposta =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    nome_completo,
                                    email,
                                    senha
                                })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "Resposta do cadastro:",
                    dados
                );


                // =====================================
                // ERRO
                // =====================================

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível criar a conta."
                    );

                    return;

                }


                // =====================================
                // CADASTRO CONCLUÍDO
                // =====================================

                alert(
                    "Conta criada com sucesso! Agora você pode entrar."
                );


                // =====================================
                // LIMPAR FORMULÁRIO
                // =====================================

                registerForm.reset();


                // =====================================
                // VOLTAR PARA LOGIN
                // =====================================

                if (registerScreen) {

                    registerScreen.classList.remove(
                        "active"
                    );

                }

                if (loginScreen) {

                    loginScreen.classList.add(
                        "active"
                    );

                }


                // =====================================
                // PREENCHER E-MAIL
                // =====================================

                const campoEmailLogin =
                    document.getElementById(
                        "loginEmail"
                    );


                if (
                    campoEmailLogin &&
                    dados.usuario
                ) {

                    campoEmailLogin.value =
                        dados.usuario.email;

                }


                // =====================================
                // FOCO NA SENHA
                // =====================================

                const campoSenhaLogin =
                    document.getElementById(
                        "loginPassword"
                    );


                if (campoSenhaLogin) {

                    campoSenhaLogin.focus();

                }


            } catch (error) {

                console.error(
                    "Erro no cadastro:",
                    error
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );

}


// =====================================================
// ESQUECI MINHA SENHA
// =====================================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        () => {

            window.location.href =
                "/verificar-codigo.html";

        }
    );

}


// =====================================================
// SESSÃO EXISTENTE
// =====================================================

const usuarioSalvo =
    sessionStorage.getItem(
        "usuario"
    );


if (usuarioSalvo) {

    try {

        const usuario =
            JSON.parse(
                usuarioSalvo
            );


        console.log(
            "Sessão encontrada:",
            usuario
        );


    } catch (error) {

        console.error(
            "Sessão inválida:",
            error
        );


        sessionStorage.removeItem(
            "usuario"
        );

    }

}


// =====================================================
// NAVEGAÇÃO ENTRE SEÇÕES
// =====================================================

function processarRetornoPremium() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const origem =
        parametros.get(
            "origem"
        );


    const destino =
        parametros.get(
            "destino"
        );


    if (origem !== "premium") {

        return;

    }


    const restaurado =
        restaurarPaginaInicial();


    if (!restaurado) {

        return;

    }


    if (destino === "planos") {

        const planos =
            document.getElementById(
                "planos"
            );


        if (planos) {

            setTimeout(
                () => {

                    planos.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                300
            );

        }

    }

}


// =====================================================
// RESTAURAR PÁGINA INICIAL
// =====================================================

function restaurarPaginaInicial() {

    const usuarioSalvo =
        sessionStorage.getItem(
            "usuario"
        );


    if (!usuarioSalvo) {

        return false;

    }


    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    const registerScreen =
        document.getElementById(
            "registerScreen"
        );


    const dashboardSection =
        document.getElementById(
            "dashboardSection"
        );


    if (loginScreen) {

        loginScreen.classList.remove(
            "active"
        );

        loginScreen.style.display =
            "none";

    }


    if (registerScreen) {

        registerScreen.classList.remove(
            "active"
        );

        registerScreen.style.display =
            "none";

    }


    if (dashboardSection) {

        document
            .querySelectorAll(
                ".content-section"
            )
            .forEach(
                (section) => {

                    section.style.display =
                        "none";

                }
            );


        dashboardSection.style.display =
            "block";

    }


    return true;

}


// =====================================================
// MOSTRAR SEÇÃO
// =====================================================

function showSection(
    sectionId
) {

    const sections =
        document.querySelectorAll(
            ".content-section"
        );


    sections.forEach(
        (section) => {

            section.style.display =
                "none";

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.style.display =
            "block";

    }

}


// =====================================================
// FILTRO DOS JOGOS
// =====================================================

function filterGames(
    subject,
    button
) {

    const cards =
        document.querySelectorAll(
            ".educational-game"
        );


    cards.forEach(
        (card) => {

            const cardSubject =
                card.dataset.subject;


            if (
                subject === "todos" ||
                cardSubject === subject
            ) {

                card.style.display =
                    "";

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    // =====================================
    // ATUALIZAR BOTÃO ATIVO
    // =====================================

    const filters =
        document.querySelectorAll(
            ".game-filter"
        );


    filters.forEach(
        (filter) => {

            filter.classList.remove(
                "active"
            );

        }
    );


    if (button) {

        button.classList.add(
            "active"
        );

    }

}


// =====================================================
// EXPORTAR FUNÇÕES
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        processarRetornoPremium();

    }
);


window.showSection =
    showSection;


window.filterGames =
    filterGames;


// =====================================================
// FINAL
// =====================================================

console.log(
    "Aldemar Studios iniciado com sucesso."
);