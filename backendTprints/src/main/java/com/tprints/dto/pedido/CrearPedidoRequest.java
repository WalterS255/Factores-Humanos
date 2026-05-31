package com.tprints.dto.pedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CrearPedidoRequest {

    @NotNull
    private Long idDireccionEnvio;

    // TARJETA, PSE, NEQUI, DAVIPLATA, TRANSFERENCIA, EFECTIVO
    @NotNull
    private String metodoPago;

    @Valid
    @NotEmpty
    private List<PedidoItemRequest> items;
}