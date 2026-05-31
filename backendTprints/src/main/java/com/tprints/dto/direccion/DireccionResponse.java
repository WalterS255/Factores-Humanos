package com.tprints.dto.direccion;

import com.tprints.entity.Direccion;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DireccionResponse {

    private final Long idDireccion;
    private final String nombreRecibe;
    private final String telefonoContacto;
    private final String direccion;
    private final String ciudad;
    private final String departamento;
    private final String codigoPostal;
    private final String indicaciones;
    private final Boolean esPrincipal;
    private final LocalDateTime fechaCreacion;

    public DireccionResponse(Direccion d) {
        this.idDireccion = d.getIdDireccion();
        this.nombreRecibe = d.getNombreRecibe();
        this.telefonoContacto = d.getTelefonoContacto();
        this.direccion = d.getDireccion();
        this.ciudad = d.getCiudad();
        this.departamento = d.getDepartamento();
        this.codigoPostal = d.getCodigoPostal();
        this.indicaciones = d.getIndicaciones();
        this.esPrincipal = d.getEsPrincipal();
        this.fechaCreacion = d.getFechaCreacion();
    }
}
