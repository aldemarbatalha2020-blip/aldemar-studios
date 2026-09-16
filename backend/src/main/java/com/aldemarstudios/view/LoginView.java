package com.aldemarstudios.view;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

@Route("login")
@PageTitle("Entrar | Aldemar Studios")
@AnonymousAllowed
public class LoginView extends VerticalLayout {

    public LoginView() {

        setSizeFull();
        setPadding(false);
        setSpacing(false);

        getStyle()
                .set("background",
                        "radial-gradient(circle at top, #0b2a4a 0%, #020817 45%, #00040a 100%)")
                .set("color", "#ffffff");

        VerticalLayout container = new VerticalLayout();
        container.setWidth("min(420px, 92vw)");
        container.setPadding(true);
        container.setSpacing(true);
        container.setAlignItems(Alignment.STRETCH);

        container.getStyle()
                .set("background", "rgba(5, 18, 35, 0.92)")
                .set("border", "1px solid rgba(0, 174, 255, 0.35)")
                .set("border-radius", "20px")
                .set("box-shadow", "0 0 40px rgba(0, 140, 255, 0.15)")
                .set("padding", "32px");

        H1 titulo = new H1("ALDEMAR STUDIOS");

        titulo.getStyle()
                .set("margin", "0")
                .set("text-align", "center")
                .set("font-size", "28px")
                .set("letter-spacing", "2px")
                .set("color", "#00b7ff");

        LoginForm loginForm = new LoginForm();

        loginForm.setAction("login");

        loginForm.getStyle()
                .set("width", "100%");

        container.add(titulo, loginForm);

        add(container);
    }
}