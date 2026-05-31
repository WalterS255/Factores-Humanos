package com.tprints.repository;

import com.tprints.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuario_IdUsuarioOrderByFechaCreacionDesc(Long idUsuario);

    List<Pedido> findAllByOrderByFechaCreacionDesc();
}