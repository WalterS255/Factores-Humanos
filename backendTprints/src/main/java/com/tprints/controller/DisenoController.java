package com.tprints.controller;

import com.tprints.dto.diseno.CreateDisenoRequest;
import com.tprints.dto.diseno.DisenoResponse;
import com.tprints.dto.diseno.RechazarDisenoRequest;
import com.tprints.service.DisenoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disenos")
@RequiredArgsConstructor
public class DisenoController {

    private final DisenoService disenoService;

    @GetMapping("/aprobados")
    public List<DisenoResponse> listarAprobados() {
        return disenoService.listarAprobados();
    }

    @GetMapping("/mis-disenos")
    public List<DisenoResponse> listarMisDisenos(Authentication authentication) {
        return disenoService.listarMisDisenos(authentication.getName());
    }

    @PostMapping
    public DisenoResponse crear(
            Authentication authentication,
            @Valid @RequestBody CreateDisenoRequest request
    ) {
        return disenoService.crearDiseno(authentication.getName(), request);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/pendientes")
    public List<DisenoResponse> listarPendientes() {
        return disenoService.listarPendientes();
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{idDiseno}/aprobar")
    public DisenoResponse aprobar(
            @PathVariable Long idDiseno,
            Authentication authentication
    ) {
        return disenoService.aprobar(idDiseno, authentication.getName());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{idDiseno}/rechazar")
    public DisenoResponse rechazar(
            @PathVariable Long idDiseno,
            Authentication authentication,
            @Valid @RequestBody RechazarDisenoRequest request
    ) {
        return disenoService.rechazar(idDiseno, authentication.getName(), request);
    }
}