package com.tprints.dto.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class ProductoResponse {

    private Long idProducto;
    private String nombre;
    private String descripcion;
    private BigDecimal precioBase;
    private Boolean activo;
    private List<VarianteResponse> variantes;

    @Data
    public static class CreateVarianteRequest {

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
}