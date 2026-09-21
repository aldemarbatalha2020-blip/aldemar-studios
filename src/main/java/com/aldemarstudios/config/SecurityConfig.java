package com.aldemarstudios.config;

import com.aldemarstudios.security.UsuarioUserDetailsService;
import org.springframework.context.annotation.Bean;
import com.vaadin.flow.spring.security.VaadinSecurityConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final UsuarioUserDetailsService usuarioUserDetailsService;

    public SecurityConfig(UsuarioUserDetailsService usuarioUserDetailsService) {
        this.usuarioUserDetailsService = usuarioUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .userDetailsService(usuarioUserDetailsService)

            .with(VaadinSecurityConfigurer.vaadin(), vaadin -> vaadin
                .enableCsrfConfiguration(true)
                .enableAuthorizedRequestsConfiguration(false)
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    "/api/health",
                    "/api/auth/**",
                    "/error"
                ).permitAll()

                .requestMatchers(
                    "/actuator/health/**"
                ).permitAll()

                .requestMatchers(
                    "/",
                    "/index.html",
                    "/*.html",
                    "/css/**",
                    "/js/**",
                    "/img/**",
                    "/fonts/**",
                    "/assets/**",
                    "/videos/**",
                    "/pdfs/**",
                    "/login",
                    "/login/**",
                    "/cadastro",
                    "/cadastro/**",
                    "/recuperar-senha",
                    "/recuperar-senha/**",
                    "/VAADIN/**",
                    "/vaadinServlet/**",
                    "/frontend/**",
                    "/icons/**",
                    "/images/**",
                    "/styles/**",
                    "/line-awesome/**",
                    "/favicon.ico"
                ).permitAll()

                .anyRequest().authenticated()
            )

            .exceptionHandling(exceptions -> exceptions
                .defaultAuthenticationEntryPointFor(
                    (request, response, authException) -> {
                        response.setStatus(
                            HttpStatus.UNAUTHORIZED.value()
                        );

                        response.setContentType(
                            "application/json;charset=UTF-8"
                        );

                        response.getWriter().write(
                            "{\"status\":401,\"error\":\"Nao autenticado\"}"
                        );
                    },
                    request ->
                        request.getRequestURI().startsWith("/api/")
                )
            )

            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?erro=true")
                .permitAll()
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )

            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
                .sessionFixation(sessionFixation ->
                    sessionFixation.migrateSession()
                )
                .maximumSessions(1)
            )

            .headers(headers -> headers
                .contentTypeOptions(contentType ->
                    contentType.disable()
                )
                .frameOptions(frame ->
                    frame.sameOrigin()
                )
                .referrerPolicy(referrer ->
                    referrer.policy(
                        org.springframework.security.web.header.writers
                            .ReferrerPolicyHeaderWriter
                            .ReferrerPolicy
                            .STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                    )
                )
            )

            .csrf(csrf -> csrf
                .ignoringRequestMatchers(
                    "/api/**",
                    "/VAADIN/**",
                    "/vaadinServlet/**"
                )
            );

        return http.build();
    }
}


