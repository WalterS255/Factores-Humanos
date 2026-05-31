package com.tprints.repository;

import com.tprints.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    List<Direccion> findByUsuario_IdUsuario(Long idUsuario);

    Optional<Direccion> findByIdDireccionAndUsuario_IdUsuario(Long idDireccion, Long idUsuario);
}