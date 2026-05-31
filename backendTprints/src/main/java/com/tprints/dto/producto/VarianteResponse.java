package com.tprints.dto.producto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class VarianteResponse {

    private Long idVariante;
    private String color;
    private String talla;
    private Integer stock;
    private String sku;
    private String imagenUrl;
    private BigDecimal precioAdicional;
    private Boolean activo;
}