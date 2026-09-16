package com.aldemarstudios.view;

import com.aldemarstudios.dto.CadastroRequest;
import com.aldemarstudios.service.CadastroService;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import jakarta.annotation.security.PermitAll;

@Route("cadastro")
@PageTitle("Cadastro | Aldemar Studios")
@PermitAll
public class CadastroView extends VerticalLayout {

    private final CadastroService cadastroService;

    private final TextField nome = new TextField("Nome completo");
    private final TextField email = new TextField("E-mail");
    private final PasswordField senha = new PasswordField("Senha");
    private final PasswordField confirmacaoSenha =
            new PasswordField("Confirmar senha");

    private final Button cadastrar =
            new Button("CRIAR CONTA");

    public CadastroView(CadastroService cadastroService) {

        this.cadastroService = cadastroService;

        configurarPagina();
        configurarFormulario();
    }

    private void configurarPagina() {

        setSizeFull();

        setAlignItems(
                Alignment.CENTER
        );

        setJustifyContentMode(
                JustifyContentMode.CENTER
        );

        setPadding(true);

        getStyle()
                .set("background", "#050b18")
                .set("color", "#ffffff");

        H2 titulo = new H2("ALDEMAR STUDIOS");

        titulo.getStyle()
                .set("color", "#00aaff")
                .set("font-weight", "800")
                .set("letter-spacing", "2px");

        Paragraph subtitulo =
                new Paragraph("CRIAR NOVA CONTA");

        subtitulo.getStyle()
                .set("color", "#8ab4d8")
                .set("font-size", "14px")
                .set("letter-spacing", "1px");

        add(titulo, subtitulo);
    }

    private void configurarFormulario() {

        VerticalLayout formulario =
                new VerticalLayout();

        formulario.setWidth("min(420px, 95vw)");
        formulario.setPadding(true);
        formulario.setSpacing(true);

        formulario.getStyle()
                .set("background", "#0b1628")
                .set("border", "1px solid #12385a")
                .set("border-radius", "18px")
                .set("padding", "28px")
                .set("box-shadow",
                        "0 0 35px rgba(0,170,255,0.12)");

        nome.setWidthFull();
        email.setWidthFull();
        senha.setWidthFull();
        confirmacaoSenha.setWidthFull();

        email.setPlaceholder("seuemail@exemplo.com");

        senha.setMinLength(8);
        senha.setMaxLength(128);

        confirmacaoSenha.setMinLength(8);
        confirmacaoSenha.setMaxLength(128);

        cadastrar.setWidthFull();

        cadastrar.addThemeVariants(
                ButtonVariant.LUMO_PRIMARY
        );

        cadastrar.getStyle()
                .set("font-weight", "800")
                .set("letter-spacing", "1px");

        cadastrar.addClickListener(
                evento -> realizarCadastro()
        );

        Anchor voltarLogin =
                new Anchor("login", "← VOLTAR PARA LOGIN");

        voltarLogin.getStyle()
                .set("color", "#00aaff")
                .set("text-decoration", "none");

        formulario.add(
                nome,
                email,
                senha,
                confirmacaoSenha,
                cadastrar,
                voltarLogin
        );

        add(formulario);
    }

    private void realizarCadastro() {

        cadastrar.setEnabled(false);

        try {

            CadastroRequest request =
                    new CadastroRequest(
                            nome.getValue(),
                            email.getValue(),
                            senha.getValue(),
                            confirmacaoSenha.getValue()
                    );

            cadastroService.cadastrar(request);

            Notification notification =
                    Notification.show(
                            "Conta criada com sucesso! Agora você pode fazer login.",
                            5000,
                            Notification.Position.TOP_CENTER
                    );

            notification.addThemeVariants(
                    NotificationVariant.LUMO_SUCCESS
            );

            limparFormulario();

        } catch (IllegalArgumentException e) {

            mostrarErro(e.getMessage());

        } catch (Exception e) {

            mostrarErro(
                    "Não foi possível concluir o cadastro. Tente novamente."
            );

        } finally {

            cadastrar.setEnabled(true);
        }
    }

    private void limparFormulario() {

        nome.clear();
        email.clear();
        senha.clear();
        confirmacaoSenha.clear();
    }

    private void mostrarErro(String mensagem) {

        Notification notification =
                Notification.show(
                        mensagem,
                        5000,
                        Notification.Position.TOP_CENTER
                );

        notification.addThemeVariants(
                NotificationVariant.LUMO_ERROR
        );
    }
}