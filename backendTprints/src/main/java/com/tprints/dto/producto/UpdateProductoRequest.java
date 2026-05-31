package com.tprints.dto.producto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductoRequest {

    private String nombre;
    private String descripcion;
    private BigDecimal precioBase;
    private Boolean activo;
}