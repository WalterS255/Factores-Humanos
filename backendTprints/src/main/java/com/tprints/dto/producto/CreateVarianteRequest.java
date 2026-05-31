package com.tprints.dto.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateVarianteRequest {

    @NotBlank
    private String color;

    @NotBlank
    private String talla;

    @NotNull
    private Integer stock;

    private String sku;

    private String imagenUrl;

    private BigDecimal precioAdicional;
}