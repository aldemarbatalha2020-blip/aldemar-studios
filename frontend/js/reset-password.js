const form = document.getElementById("resetForm");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("btnReset");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = sessionStorage.getItem("recuperacao_token");
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    mensagem.className = "";
    mensagem.textContent = "";

    if (!token) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = "Sessão de recuperação expirada. Solicite um novo código.";
        return;
    }

    if (novaSenha.length < 8) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = "A nova senha deve possuir pelo menos 8 caracteres.";
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = "As senhas não coincidem.";
        return;
    }

    botao.disabled = true;
    botao.textContent = "SALVANDO...";

    try {
        const resposta = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                nova_senha: novaSenha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.message ||
                dados.mensagem ||
                "Não foi possível redefinir a senha."
            );
        }

        sessionStorage.removeItem("recuperacao_email");
        sessionStorage.removeItem("recuperacao_token");

        mensagem.className = "mensagem-sucesso";
        mensagem.textContent = "✓ Senha redefinida com sucesso! Voltando ao login...";

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1500);

    } catch (erro) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = erro.message;

        botao.disabled = false;
        botao.textContent = "SALVAR NOVA SENHA";
    }
});
