package com.tprints.controller;

import com.tprints.dto.producto.CreateProductoRequest;
import com.tprints.dto.producto.ProductoResponse;
import com.tprints.dto.producto.UpdateProductoRequest;
import com.tprints.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<ProductoResponse> listar() {
        return productoService.listarProductosActivos();
    }

    @GetMapping("/{idProducto}")
    public ProductoResponse obtenerPorId(@PathVariable Long idProducto) {
        return productoService.obtenerPorId(idProducto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ProductoResponse crear(@Valid @RequestBody CreateProductoRequest request) {
        return productoService.crearProducto(request);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{idProducto}")
    public ProductoResponse actualizar(
            @PathVariable Long idProducto,
            @RequestBody UpdateProductoRequest request
    ) {
        return productoService.actualizarProducto(idProducto, request);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{idProducto}")
    public void eliminar(@PathVariable Long idProducto) {
        productoService.eliminarProducto(idProducto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/{idProducto}/variantes")
    public ProductoResponse crearVariante(
            @PathVariable Long idProducto,
            @Valid @RequestBody ProductoResponse.CreateVarianteRequest request
    ) {
        return productoService.crearVariante(idProducto, null);
    }
}