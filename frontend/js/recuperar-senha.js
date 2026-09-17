document.getElementById("recuperarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("btnEnviar");

    mensagem.className = "";
    mensagem.textContent = "";
    botao.disabled = true;
    botao.textContent = "ENVIANDO...";

    try {
        const resposta = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.message || "Não foi possível enviar o código.");
        }

        sessionStorage.setItem("recuperacao_email", email);

        mensagem.className = "mensagem-sucesso";
        mensagem.textContent = "Código enviado! Redirecionando...";

        setTimeout(() => {
            window.location.href = "/verificar-codigo.html";
        }, 700);

    } catch (erro) {
        mensagem.className = "mensagem-erro";
        mensagem.textContent = erro.message;
        botao.disabled = false;
        botao.textContent = "ENVIAR CÓDIGO";
    }
});
