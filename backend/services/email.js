const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function enviarEmail({
    para,
    assunto,
    html,
    texto
}) {

    const info = await transporter.sendMail({

        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,

        to: para,

        subject: assunto,

        text: texto,

        html: html

    });

    console.log(
        "E-mail enviado com sucesso:",
        info.messageId
    );

    return info;

}

async function testarEmail() {

    await transporter.verify();

    console.log(
        "Conexão SMTP com a Brevo verificada com sucesso."
    );

}

module.exports = {
    enviarEmail,
    testarEmail
};