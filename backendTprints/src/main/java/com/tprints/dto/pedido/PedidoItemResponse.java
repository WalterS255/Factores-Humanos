package com.tprints.dto.pedido;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PedidoItemResponse {

    private Long idPedidoItem;
    private Long idVariante;
    private String producto;
    private String color;
    private String talla;
    private Long idDiseno;
    private String tituloDiseno;
    private String imagenPersonalizadaUrl;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}