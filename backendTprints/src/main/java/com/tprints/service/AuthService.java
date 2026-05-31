package com.tprints.service;

import com.tprints.dto.auth.AuthResponse;
import com.tprints.dto.auth.LoginRequest;
import com.tprints.dto.auth.RegisterRequest;
import com.tprints.entity.Role;
import com.tprints.entity.Usuario;
import com.tprints.exception.ApiException;
import com.tprints.repository.RoleRepository;
import com.tprints.repository.UsuarioRepository;
import com.tprints.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new ApiException("El correo ya está registrado", HttpStatus.CONFLICT);
        }

        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new ApiException("El nombre de usuario ya está registrado", HttpStatus.CONFLICT);
        }

        String rolSolicitado = request.getRol() == null
                ? "CLIENTE"
                : request.getRol().toUpperCase();

        if (rolSolicitado.equals("ADMINISTRADOR")) {
            throw new ApiException(
                    "No se puede registrar un administrador desde el formulario público",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (!rolSolicitado.equals("CLIENTE") && !rolSolicitado.equals("DISENADOR")) {
            rolSolicitado = "CLIENTE";
        }

        Role role = roleRepository.findByNombre(rolSolicitado)
                .orElseThrow(() -> new ApiException(
                        "Rol no encontrado en base de datos: " + "rol",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));

        Usuario usuario = new Usuario();
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreo(request.getCorreo());
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setFotoPerfilUrl(request.getFotoPerfilUrl());
        usuario.getRoles().add(role);

        Usuario saved = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(saved);

        return buildAuthResponse(saved, token);
    }

    public AuthResponse login(LoginRequest request) {
        String identificador = request.getIdentificador();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        identificador,
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository
                .findByCorreoOrNombreUsuario(identificador, identificador)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        String token = jwtService.generateToken(usuario);

        return buildAuthResponse(usuario, token);
    }
private AuthResponse buildAuthResponse(Usuario usuario, String token) {
    List<String> roles = usuario.getRoles()
            .stream()
            .map(Role::getNombre)
            .toList();

    return new AuthResponse(
            token,
            usuario.getIdUsuario(),
            usuario.getNombres(),
            usuario.getApellidos(),
            usuario.getCorreo(),
            usuario.getNombreUsuario(),
            usuario.getFotoPerfilUrl(),
            roles
    );
}
}