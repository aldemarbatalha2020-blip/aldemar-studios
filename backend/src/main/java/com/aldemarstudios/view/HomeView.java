package com.aldemarstudios.view;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import jakarta.annotation.security.PermitAll;

@Route("")
@PageTitle("Aldemar Studios")
@PermitAll
public class HomeView extends VerticalLayout {

    public HomeView() {

        setSizeFull();
        setPadding(false);
        setSpacing(false);
        setMargin(false);

        getStyle()
                .set("background", "radial-gradient(circle at top, #102b55 0%, #050b16 45%, #02050a 100%)")
                .set("color", "white")
                .set("overflow-x", "hidden");

        criarCabecalho();
        criarHero();
        criarRecursos();
        criarRodape();
    }

    private void criarCabecalho() {

        HorizontalLayout header = new HorizontalLayout();
        header.setWidthFull();
        header.setPadding(true);
        header.setSpacing(true);
        header.setAlignItems(FlexComponent.Alignment.CENTER);
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);

        header.getStyle()
                .set("padding", "18px 7%")
                .set("background", "rgba(2, 8, 20, 0.88)")
                .set("border-bottom", "1px solid rgba(0, 174, 255, 0.20)")
                .set("backdrop-filter", "blur(14px)")
                .set("box-shadow", "0 5px 30px rgba(0, 0, 0, 0.35)");

        H2 logo = new H2("ALDEMAR STUDIOS");

        logo.getStyle()
                .set("margin", "0")
                .set("font-size", "clamp(20px, 3vw, 30px)")
                .set("font-weight", "800")
                .set("letter-spacing", "2px")
                .set("color", "#38bdf8")
                .set("text-shadow", "0 0 18px rgba(56,189,248,0.55)");

        HorizontalLayout menu = new HorizontalLayout();
        menu.setSpacing(true);
        menu.setAlignItems(FlexComponent.Alignment.CENTER);

        Button entrar = criarBotao("ENTRAR", false);
        entrar.addClickListener(event ->
                UI.getCurrent().navigate("login")
        );

        Button cadastro = criarBotao("CRIAR CONTA", true);
        cadastro.addClickListener(event ->
                UI.getCurrent().navigate("cadastro")
        );

        menu.add(entrar, cadastro);

        header.add(logo, menu);

        add(header);
    }

    private void criarHero() {

        VerticalLayout hero = new VerticalLayout();

        hero.setWidthFull();
        hero.setAlignItems(FlexComponent.Alignment.CENTER);
        hero.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);
        hero.setPadding(true);

        hero.getStyle()
                .set("min-height", "620px")
                .set("padding", "80px 7%")
                .set("text-align", "center")
                .set("position", "relative")
                .set("box-sizing", "border-box");

        Span pequenoTitulo = new Span("PLATAFORMA EDUCACIONAL DIGITAL");

        pequenoTitulo.getStyle()
                .set("color", "#38bdf8")
                .set("font-size", "13px")
                .set("font-weight", "700")
                .set("letter-spacing", "4px")
                .set("margin-bottom", "20px");

        H1 titulo = new H1("APRENDA.");
        
        titulo.getStyle()
                .set("margin", "0")
                .set("font-size", "clamp(48px, 10vw, 100px)")
                .set("font-weight", "900")
                .set("line-height", "0.95")
                .set("letter-spacing", "-4px")
                .set("background", "linear-gradient(90deg, #ffffff, #38bdf8, #60a5fa)")
                .set("background-clip", "text")
                .set("-webkit-background-clip", "text")
                .set("-webkit-text-fill-color", "transparent")
                .set("filter", "drop-shadow(0 0 25px rgba(56,189,248,0.25))");

        H2 subtitulo = new H2("JOGUE. EVOLUA.");

        subtitulo.getStyle()
                .set("margin", "8px 0 25px")
                .set("font-size", "clamp(26px, 5vw, 52px)")
                .set("font-weight", "800")
                .set("color", "#e2e8f0");

        Paragraph descricao = new Paragraph(
                "Uma nova experiência para aprender, praticar e explorar conhecimento."
        );

        descricao.getStyle()
                .set("max-width", "650px")
                .set("font-size", "18px")
                .set("line-height", "1.7")
                .set("color", "#94a3b8")
                .set("margin", "0 auto 35px");

        HorizontalLayout botoes = new HorizontalLayout();
        botoes.setSpacing(true);
        botoes.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

        Button comecar = criarBotao("COMEÇAR AGORA", true);
        comecar.addClickListener(event ->
                UI.getCurrent().navigate("cadastro")
        );

        Button acessar = criarBotao("JÁ TENHO CONTA", false);
        acessar.addClickListener(event ->
                UI.getCurrent().navigate("login")
        );

        botoes.add(comecar, acessar);

        hero.add(pequenoTitulo, titulo, subtitulo, descricao, botoes);

        add(hero);
    }

    private void criarRecursos() {

        VerticalLayout secao = new VerticalLayout();

        secao.setWidthFull();
        secao.setPadding(true);
        secao.setSpacing(true);
        secao.setAlignItems(FlexComponent.Alignment.CENTER);

        secao.getStyle()
                .set("padding", "70px 7% 90px")
                .set("background", "rgba(255,255,255,0.015)")
                .set("border-top", "1px solid rgba(56,189,248,0.08)");

        H2 titulo = new H2("UM NOVO JEITO DE APRENDER");

        titulo.getStyle()
                .set("font-size", "clamp(25px, 5vw, 42px)")
                .set("text-align", "center")
                .set("margin", "0 0 35px")
                .set("color", "#f8fafc");

        HorizontalLayout cards = new HorizontalLayout();
        cards.setWidthFull();
        cards.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);
        cards.setSpacing(true);

        Div cursos = criarCard(
                "01",
                "CURSOS",
                "Conteúdos organizados para você estudar no seu ritmo."
        );

        Div jogos = criarCard(
                "02",
                "JOGOS",
                "Aprenda praticando através de experiências interativas."
        );

        Div premium = criarCard(
                "03",
                "ÁREA PREMIUM",
                "Conteúdos exclusivos para quem quer avançar ainda mais."
        );

        cards.add(cursos, jogos, premium);

        secao.add(titulo, cards);

        add(secao);
    }

    private Div criarCard(String numero, String tituloTexto, String descricao) {

        Div card = new Div();

        card.getStyle()
                .set("width", "min(100%, 330px)")
                .set("min-height", "210px")
                .set("padding", "28px")
                .set("box-sizing", "border-box")
                .set("background", "linear-gradient(145deg, rgba(15,35,65,0.90), rgba(5,12,25,0.95))")
                .set("border", "1px solid rgba(56,189,248,0.18)")
                .set("border-radius", "18px")
                .set("box-shadow", "0 15px 45px rgba(0,0,0,0.25)")
                .set("transition", "transform 0.2s ease");

        Span numeroSpan = new Span(numero);

        numeroSpan.getStyle()
                .set("font-size", "13px")
                .set("font-weight", "800")
                .set("color", "#38bdf8")
                .set("letter-spacing", "2px");

        H2 titulo = new H2(tituloTexto);

        titulo.getStyle()
                .set("margin", "18px 0 12px")
                .set("font-size", "24px")
                .set("color", "#f8fafc");

        Paragraph texto = new Paragraph(descricao);

        texto.getStyle()
                .set("margin", "0")
                .set("line-height", "1.6")
                .set("color", "#94a3b8");

        card.add(numeroSpan, titulo, texto);

        return card;
    }

    private void criarRodape() {

        VerticalLayout rodape = new VerticalLayout();

        rodape.setWidthFull();
        rodape.setAlignItems(FlexComponent.Alignment.CENTER);
        rodape.setSpacing(false);

        rodape.getStyle()
                .set("padding", "35px 20px")
                .set("background", "#02050a")
                .set("border-top", "1px solid rgba(56,189,248,0.12)")
                .set("text-align", "center");

        Span nome = new Span("ALDEMAR STUDIOS");

        nome.getStyle()
                .set("font-weight", "800")
                .set("letter-spacing", "2px")
                .set("color", "#38bdf8");

        Span credito = new Span("Developed by Aldemar Florêncio");

        credito.getStyle()
                .set("margin-top", "8px")
                .set("font-size", "13px")
                .set("color", "#64748b");

        rodape.add(nome, credito);

        add(rodape);
    }

    private Button criarBotao(String texto, boolean principal) {

        Button botao = new Button(texto);

        botao.getStyle()
                .set("border-radius", "10px")
                .set("padding", "13px 22px")
                .set("font-weight", "800")
                .set("font-size", "13px")
                .set("letter-spacing", "0.8px")
                .set("cursor", "pointer")
                .set("transition", "all 0.2s ease");

        if (principal) {

            botao.getStyle()
                    .set("background", "linear-gradient(135deg, #0284c7, #2563eb)")
                    .set("color", "white")
                    .set("border", "1px solid #38bdf8")
                    .set("box-shadow", "0 0 25px rgba(37,99,235,0.30)");

        } else {

            botao.getStyle()
                    .set("background", "rgba(15,23,42,0.75)")
                    .set("color", "#bae6fd")
                    .set("border", "1px solid rgba(56,189,248,0.30)");
        }

        return botao;
    }
}