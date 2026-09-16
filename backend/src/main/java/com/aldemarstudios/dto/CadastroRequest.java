package com.aldemarstudios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(

    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 3, max = 150, message = "O nome deve ter entre 3 e 150 caracteres.")
    String nome,

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    @Size(max = 255, message = "O e-mail deve ter no máximo 255 caracteres.")
    String email,

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 8, max = 128, message = "A senha deve ter entre 8 e 128 caracteres.")
    String senha,

    @NotBlank(message = "A confirmação de senha é obrigatória.")
    String confirmacaoSenha
) {
}