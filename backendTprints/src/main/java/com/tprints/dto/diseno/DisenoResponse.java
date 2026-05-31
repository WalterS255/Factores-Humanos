package com.tprints.dto.diseno;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DisenoResponse {

    private Long idDiseno;
    private Long idUsuario;
    private String nombreUsuario;
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private String estado;
    private String motivoRechazo;
    private LocalDateTime fechaCreacion;
}