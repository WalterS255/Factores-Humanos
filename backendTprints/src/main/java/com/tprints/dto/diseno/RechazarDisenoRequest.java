package com.tprints.dto.diseno;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RechazarDisenoRequest {

    @NotBlank
    private String motivoRechazo;
}