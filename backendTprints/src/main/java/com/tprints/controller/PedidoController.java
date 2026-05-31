package com.tprints.controller;

import com.tprints.dto.pedido.CrearPedidoRequest;
import com.tprints.dto.pedido.PedidoResponse;
import com.tprints.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public PedidoResponse crearPedido(
            Authentication authentication,
            @Valid @RequestBody CrearPedidoRequest request
    ) {
        return pedidoService.crearPedido(authentication.getName(), request);
    }

    @GetMapping("/mis-pedidos")
    public List<PedidoResponse> listarMisPedidos(Authentication authentication) {
        return pedidoService.listarMisPedidos(authentication.getName());
    }

    @GetMapping("/{idPedido}")
    public PedidoResponse obtenerPorId(@PathVariable Long idPedido) {
        return pedidoService.obtenerPorId(idPedido);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<PedidoResponse> listarTodos() {
        return pedidoService.listarTodos();
    }
}