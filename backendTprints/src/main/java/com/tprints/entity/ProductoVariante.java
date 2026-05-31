package com.tprints.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "producto_variantes")
@Getter
@Setter
@NoArgsConstructor
public class ProductoVariante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_variante")
    private Long idVariante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @Column(name = "talla", nullable = false, length = 10)
    private String talla;

    @Column(name = "stock", nullable = false)
    private Integer stock = 0;

    @Column(name = "sku", unique = true, length = 80)
    private String sku;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "precio_adicional", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioAdicional = BigDecimal.ZERO;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}