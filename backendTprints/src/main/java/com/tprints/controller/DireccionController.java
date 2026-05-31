package com.tprints.controller;

import com.tprints.dto.direccion.DireccionRequest;
import com.tprints.dto.direccion.DireccionResponse;
import com.tprints.service.DireccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    @GetMapping
    public ResponseEntity<List<DireccionResponse>> listar(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(direccionService.listarMisDirecciones(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<DireccionResponse> crear(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DireccionRequest request) {
        DireccionResponse response = direccionService.crear(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{idDireccion}")
    public ResponseEntity<DireccionResponse> actualizar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long idDireccion,
            @Valid @RequestBody DireccionRequest request) {
        return ResponseEntity.ok(
                direccionService.actualizar(userDetails.getUsername(), idDireccion, request));
    }

    @DeleteMapping("/{idDireccion}")
    public ResponseEntity<Void> eliminar(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long idDireccion) {
        direccionService.eliminar(userDetails.getUsername(), idDireccion);
        return ResponseEntity.noContent().build();
    }
}
