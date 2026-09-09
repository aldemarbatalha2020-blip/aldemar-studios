document.getElementById("verificarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = sessionStorage.getItem("recuperacao_email");
    const codigo = document.getElementById("codigo").value.trim();
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("btnVerificar");

    mensagem.className = "";
    mensagem.textContent = "";

    if (!email) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = "Sessão de recuperação não encontrada. Solicite um novo código.";
        return;
    }

    if (!/^\d{6}$/.test(codigo)) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = "Digite o código de 6 dígitos.";
        return;
    }

    botao.disabled = true;
    botao.textContent = "VERIFICANDO...";

    try {
        const resposta = await fetch("/api/auth/verify-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                codigo: codigo
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.message || "Código inválido ou expirado.");
        }

        const token = dados.token || dados.resetToken || dados.reset_token;

        if (!token) {
            throw new Error("Código confirmado, mas o token de recuperação não foi recebido.");
        }

        sessionStorage.setItem("recuperacao_token", token);

        mensagem.className = "mensagem-sucesso";
        mensagem.textContent = "Código confirmado! Criando nova senha...";

        setTimeout(() => {
            window.location.href = "/reset-password.html";
        }, 700);

    } catch (erro) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = erro.message;

        botao.disabled = false;
        botao.textContent = "VERIFICAR CÓDIGO";
    }
});

document.getElementById("codigo").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 6);
});
