package com.tprints.dto.direccion;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DireccionRequest {

    @NotBlank(message = "El nombre de quien recibe es obligatorio")
    private String nombreRecibe;

    private String telefonoContacto;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    private String departamento;

    private String codigoPostal;

    private String indicaciones;

    private Boolean esPrincipal = false;
}
