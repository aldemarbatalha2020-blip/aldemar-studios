// =========================================
// CONFIGURAÇÃO DA API
// =========================================

const API_URL = "http://localhost:3000/api";


// =========================================
// TELAS
// =========================================

const loginScreen = document.getElementById("loginScreen");
const registerScreen = document.getElementById("registerScreen");


// =========================================
// BOTÕES
// =========================================

const openRegister = document.getElementById("openRegister");
const backToLogin = document.getElementById("backToLogin");
const forgotPassword = document.getElementById("forgotPassword");


// =========================================
// FORMULÁRIOS
// =========================================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");


// =========================================
// TROCAR PARA CADASTRO
// =========================================

openRegister.addEventListener("click", () => {

    loginScreen.classList.remove("active");

    registerScreen.classList.add("active");

});


// =========================================
// VOLTAR PARA LOGIN
// =========================================

backToLogin.addEventListener("click", () => {

    registerScreen.classList.remove("active");

    loginScreen.classList.add("active");

});


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const senha =
        document.getElementById("loginPassword").value;


    try {

        const resposta = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        const dados = await resposta.json();


        // =====================================
        // ERRO
        // =====================================

        if (!resposta.ok) {

            alert(dados.mensagem);

            return;

        }


        // =====================================
        // LOGIN REALIZADO
        // =====================================

        console.log(
            "Usuário autenticado:",
            dados.usuario
        );


        // Guardar somente informações necessárias
        // da sessão atual

        sessionStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );


        alert(
            `Bem-vindo, ${dados.usuario.nome_completo}!`
        );

        window.location.href = "dashboard.html";


        // Por enquanto vamos apenas confirmar
        // o login.
        //
        // Depois criaremos o painel principal.

        console.log(
            "Plano:",
            dados.usuario.plano
        );


    } catch (error) {

        console.error(
            "Erro ao conectar com o servidor:",
            error
        );

        alert(
            "Não foi possível conectar ao servidor."
        );

    }

});


// =========================================
// CADASTRO
// =========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const nome_completo =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const senha =
        document.getElementById("registerPassword").value;


    // =====================================
    // VALIDAÇÃO LOCAL
    // =====================================

    if (senha.length < 8) {

        alert(
            "A senha deve possuir pelo menos 8 caracteres."
        );

        return;

    }


    try {

        const resposta = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nome_completo: nome_completo,
                    email: email,
                    senha: senha
                })
            }
        );


        const dados = await resposta.json();


        // =====================================
        // ERRO
        // =====================================

        if (!resposta.ok) {

            alert(dados.mensagem);

            return;

        }


        // =====================================
        // CADASTRO REALIZADO
        // =====================================

        alert(
            "Conta criada com sucesso! Agora você pode entrar."
        );


        // Limpar formulário

        registerForm.reset();


        // Voltar para login

        registerScreen.classList.remove("active");

        loginScreen.classList.add("active");


        // Colocar o e-mail cadastrado
        // automaticamente no login

        document.getElementById("loginEmail").value =
            dados.usuario.email;


        document.getElementById("loginPassword").focus();


    } catch (error) {

        console.error(
            "Erro ao conectar com o servidor:",
            error
        );

        alert(
            "Não foi possível conectar ao servidor."
        );

    }

});


// =========================================
// ESQUECI MINHA SENHA
// =========================================

forgotPassword.addEventListener("click", () => {

    alert(
        "A recuperação de senha será disponibilizada em breve."
    );

});


// =========================================
// VERIFICAR SESSÃO
// =========================================

const usuarioSalvo =
    sessionStorage.getItem("usuario");


if (usuarioSalvo) {

    try {

        const usuario =
            JSON.parse(usuarioSalvo);

        console.log(
            "Sessão encontrada:",
            usuario
        );

    } catch (error) {

        sessionStorage.removeItem("usuario");

    }

}