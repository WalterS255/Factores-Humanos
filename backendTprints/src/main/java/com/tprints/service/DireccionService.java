package com.tprints.service;

import com.tprints.dto.direccion.DireccionRequest;
import com.tprints.dto.direccion.DireccionResponse;
import com.tprints.entity.Direccion;
import com.tprints.entity.Usuario;
import com.tprints.repository.DireccionRepository;
import com.tprints.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final UsuarioRepository usuarioRepository;

    public List<DireccionResponse> listarMisDirecciones(String correo) {
        Usuario usuario = getUsuario(correo);
        return direccionRepository.findByUsuario_IdUsuario(usuario.getIdUsuario())
                .stream()
                .map(DireccionResponse::new)
                .toList();
    }

    @Transactional
    public DireccionResponse crear(String correo, DireccionRequest request) {
        Usuario usuario = getUsuario(correo);

        if (Boolean.TRUE.equals(request.getEsPrincipal())) {
            desmarcarPrincipal(usuario.getIdUsuario());
        }

        Direccion d = new Direccion();
        d.setUsuario(usuario);
        mapearCampos(d, request);

        return new DireccionResponse(direccionRepository.save(d));
    }

    @Transactional
    public DireccionResponse actualizar(String correo, Long idDireccion, DireccionRequest request) {
        Usuario usuario = getUsuario(correo);
        Direccion d = getDireccionDelUsuario(idDireccion, usuario.getIdUsuario());

        if (Boolean.TRUE.equals(request.getEsPrincipal())) {
            desmarcarPrincipal(usuario.getIdUsuario());
        }

        mapearCampos(d, request);
        return new DireccionResponse(direccionRepository.save(d));
    }

    @Transactional
    public void eliminar(String correo, Long idDireccion) {
        Usuario usuario = getUsuario(correo);
        Direccion d = getDireccionDelUsuario(idDireccion, usuario.getIdUsuario());
        direccionRepository.delete(d);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Usuario getUsuario(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + correo));
    }

    private Direccion getDireccionDelUsuario(Long idDireccion, Long idUsuario) {
        return direccionRepository.findByIdDireccionAndUsuario_IdUsuario(idDireccion, idUsuario)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada o no pertenece al usuario"));
    }

    private void desmarcarPrincipal(Long idUsuario) {
        direccionRepository.findByUsuario_IdUsuario(idUsuario).forEach(dir -> {
            if (Boolean.TRUE.equals(dir.getEsPrincipal())) {
                dir.setEsPrincipal(false);
                direccionRepository.save(dir);
            }
        });
    }

    private void mapearCampos(Direccion d, DireccionRequest r) {
        d.setNombreRecibe(r.getNombreRecibe());
        d.setTelefonoContacto(r.getTelefonoContacto());
        d.setDireccion(r.getDireccion());
        d.setCiudad(r.getCiudad());
        d.setDepartamento(r.getDepartamento());
        d.setCodigoPostal(r.getCodigoPostal());
        d.setIndicaciones(r.getIndicaciones());
        d.setEsPrincipal(Boolean.TRUE.equals(r.getEsPrincipal()));
    }
}
