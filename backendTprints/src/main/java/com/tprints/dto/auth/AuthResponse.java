package com.tprints.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long idUsuario;
    private String nombres;
    private String apellidos;
    private String correo;
    private String nombreUsuario;
    private String fotoPerfilUrl;
    private List<String> roles;
}