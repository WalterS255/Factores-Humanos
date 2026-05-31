package com.tprints.dto.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PedidoItemRequest {

    @NotNull
    private Long idVariante;

    private Long idDiseno;

    private String imagenPersonalizadaUrl;

    @NotNull
    @Min(1)
    private Integer cantidad;

    private String notasPersonalizacion;
}