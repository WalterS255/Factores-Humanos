package com.tprints.dto.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductoRequest {

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    private BigDecimal precioBase;

    private List<CreateVarianteRequest> variantes;
}