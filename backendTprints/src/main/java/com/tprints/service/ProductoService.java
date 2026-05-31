package com.tprints.service;

import com.tprints.dto.producto.*;
import com.tprints.entity.Producto;
import com.tprints.entity.ProductoVariante;
import com.tprints.exception.ApiException;
import com.tprints.repository.ProductoRepository;
import com.tprints.repository.ProductoVarianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoVarianteRepository varianteRepository;

    public List<ProductoResponse> listarProductosActivos() {
        return productoRepository.findByActivoTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductoResponse obtenerPorId(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new ApiException("Producto no encontrado", HttpStatus.NOT_FOUND));

        return toResponse(producto);
    }

    public ProductoResponse crearProducto(CreateProductoRequest request) {
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecioBase(request.getPrecioBase());
        producto.setActivo(true);

        Producto saved = productoRepository.save(producto);

        if (request.getVariantes() != null) {
            for (CreateVarianteRequest varianteRequest : request.getVariantes()) {
                crearVariante(saved.getIdProducto(), varianteRequest);
            }
        }

        Producto reloaded = productoRepository.findById(saved.getIdProducto())
                .orElseThrow();

        return toResponse(reloaded);
    }

    public ProductoResponse actualizarProducto(Long idProducto, UpdateProductoRequest request) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new ApiException("Producto no encontrado", HttpStatus.NOT_FOUND));

        if (request.getNombre() != null) {
            producto.setNombre(request.getNombre());
        }

        if (request.getDescripcion() != null) {
            producto.setDescripcion(request.getDescripcion());
        }

        if (request.getPrecioBase() != null) {
            producto.setPrecioBase(request.getPrecioBase());
        }

        if (request.getActivo() != null) {
            producto.setActivo(request.getActivo());
        }

        return toResponse(productoRepository.save(producto));
    }

    public void eliminarProducto(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new ApiException("Producto no encontrado", HttpStatus.NOT_FOUND));

        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public ProductoResponse crearVariante(Long idProducto, CreateVarianteRequest request) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new ApiException("Producto no encontrado", HttpStatus.NOT_FOUND));

        ProductoVariante variante = new ProductoVariante();
        variante.setProducto(producto);
        variante.setColor(request.getColor());
        variante.setTalla(request.getTalla());
        variante.setStock(request.getStock());
        variante.setSku(request.getSku());
        variante.setImagenUrl(request.getImagenUrl());
        variante.setPrecioAdicional(
                request.getPrecioAdicional() == null
                        ? BigDecimal.ZERO
                        : request.getPrecioAdicional()
        );
        variante.setActivo(true);

        varianteRepository.save(variante);

        Producto reloaded = productoRepository.findById(idProducto)
                .orElseThrow();

        return toResponse(reloaded);
    }

    private ProductoResponse toResponse(Producto producto) {
        List<VarianteResponse> variantes = producto.getVariantes()
                .stream()
                .map(variante -> new VarianteResponse(
                        variante.getIdVariante(),
                        variante.getColor(),
                        variante.getTalla(),
                        variante.getStock(),
                        variante.getSku(),
                        variante.getImagenUrl(),
                        variante.getPrecioAdicional(),
                        variante.getActivo()
                ))
                .toList();

        return new ProductoResponse(
                producto.getIdProducto(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioBase(),
                producto.getActivo(),
                variantes
        );
    }
}