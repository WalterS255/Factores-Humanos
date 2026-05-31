package com.tprints.dto.pedido;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class PedidoResponse {

    private Long idPedido;
    private String estadoPedido;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal total;
    private String nombreRecibe;
    private String direccionEnvio;
    private String ciudadEnvio;
    private String departamentoEnvio;
    private LocalDateTime fechaCreacion;
    private List<PedidoItemResponse> items;
}