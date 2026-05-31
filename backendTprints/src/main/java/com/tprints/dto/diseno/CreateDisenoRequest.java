package com.tprints.dto.diseno;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDisenoRequest {

    @NotBlank
    private String titulo;

    private String descripcion;

    @NotBlank
    private String imagenUrl;
}