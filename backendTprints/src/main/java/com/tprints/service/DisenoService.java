package com.tprints.service;

import com.tprints.dto.diseno.CreateDisenoRequest;
import com.tprints.dto.diseno.DisenoResponse;
import com.tprints.dto.diseno.RechazarDisenoRequest;
import com.tprints.entity.Diseno;
import com.tprints.entity.Usuario;
import com.tprints.exception.ApiException;
import com.tprints.repository.DisenoRepository;
import com.tprints.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisenoService {

    private final DisenoRepository disenoRepository;
    private final UsuarioRepository usuarioRepository;

    public DisenoResponse crearDiseno(String correoUsuario, CreateDisenoRequest request) {
        Usuario usuario = buscarUsuarioPorCorreo(correoUsuario);

        Diseno diseno = new Diseno();
        diseno.setUsuario(usuario);
        diseno.setTitulo(request.getTitulo());
        diseno.setDescripcion(request.getDescripcion());
        diseno.setImagenUrl(request.getImagenUrl());
        diseno.setEstado("PENDIENTE");

        return toResponse(disenoRepository.save(diseno));
    }

    public List<DisenoResponse> listarAprobados() {
        return disenoRepository.findByEstado("APROBADO")
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DisenoResponse> listarPendientes() {
        return disenoRepository.findByEstado("PENDIENTE")
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DisenoResponse> listarMisDisenos(String correoUsuario) {
        Usuario usuario = buscarUsuarioPorCorreo(correoUsuario);

        return disenoRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DisenoResponse aprobar(Long idDiseno, String correoAdmin) {
        Usuario admin = buscarUsuarioPorCorreo(correoAdmin);

        Diseno diseno = disenoRepository.findById(idDiseno)
                .orElseThrow(() -> new ApiException("Diseño no encontrado", HttpStatus.NOT_FOUND));

        diseno.setEstado("APROBADO");
        diseno.setMotivoRechazo(null);
        diseno.setAdminRevision(admin);
        diseno.setFechaRevision(LocalDateTime.now());

        return toResponse(disenoRepository.save(diseno));
    }

    public DisenoResponse rechazar(Long idDiseno, String correoAdmin, RechazarDisenoRequest request) {
        Usuario admin = buscarUsuarioPorCorreo(correoAdmin);

        Diseno diseno = disenoRepository.findById(idDiseno)
                .orElseThrow(() -> new ApiException("Diseño no encontrado", HttpStatus.NOT_FOUND));

        diseno.setEstado("RECHAZADO");
        diseno.setMotivoRechazo(request.getMotivoRechazo());
        diseno.setAdminRevision(admin);
        diseno.setFechaRevision(LocalDateTime.now());

        return toResponse(disenoRepository.save(diseno));
    }

    private Usuario buscarUsuarioPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));
    }

    private DisenoResponse toResponse(Diseno diseno) {
        Usuario usuario = diseno.getUsuario();

        return new DisenoResponse(
                diseno.getIdDiseno(),
                usuario.getIdUsuario(),
                usuario.getNombres() + " " + (usuario.getApellidos() == null ? "" : usuario.getApellidos()),
                diseno.getTitulo(),
                diseno.getDescripcion(),
                diseno.getImagenUrl(),
                diseno.getEstado(),
                diseno.getMotivoRechazo(),
                diseno.getFechaCreacion()
        );
    }
}