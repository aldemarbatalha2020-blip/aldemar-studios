// =====================================================
// ALDEMAR STUDIOS
// APLICAÇÃO PRINCIPAL
// =====================================================


// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================

const API_URL =
    "https://aldemar-studios-api.onrender.com/api";


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

            loginScreen.classList.remove(
                "active"
            );

            registerScreen.classList.add(
                "active"
            );

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

            registerScreen.classList.remove(
                "active"
            );

            loginScreen.classList.add(
                "active"
            );

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

                if (
                    !dados.usuario
                ) {

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
                    JSON.stringify(
                        dados.usuario
                    )
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
                    "dashboard.html";


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


                // Limpar formulário

                registerForm.reset();


                // Voltar para login

                registerScreen.classList.remove(
                    "active"
                );

                loginScreen.classList.add(
                    "active"
                );


                // Preencher e-mail

                document
                    .getElementById("loginEmail")
                    .value =
                    dados.usuario.email;


                // Foco na senha

                document
                    .getElementById("loginPassword")
                    .focus();


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

            alert(
                "A recuperação de senha será disponibilizada em breve."
            );

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

function showSection(sectionId) {

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


    // Atualizar botão ativo

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