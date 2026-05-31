package com.tprints.repository;

import com.tprints.entity.Diseno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisenoRepository extends JpaRepository<Diseno, Long> {

    List<Diseno> findByEstado(String estado);

    List<Diseno> findByUsuario_IdUsuario(Long idUsuario);
}