package com.tprints.service;

import com.tprints.dto.pedido.CrearPedidoRequest;
import com.tprints.dto.pedido.PedidoItemRequest;
import com.tprints.dto.pedido.PedidoItemResponse;
import com.tprints.dto.pedido.PedidoResponse;
import com.tprints.entity.*;
import com.tprints.exception.ApiException;
import com.tprints.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private static final BigDecimal COSTO_ENVIO_BASE = new BigDecimal("8000");

    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final ProductoVarianteRepository varianteRepository;
    private final DisenoRepository disenoRepository;
    private final PedidoRepository pedidoRepository;
    private final PedidoItemRepository pedidoItemRepository;
    private final PagoRepository pagoRepository;
    private final EnvioRepository envioRepository;

    @Transactional
    public PedidoResponse crearPedido(String correoUsuario, CrearPedidoRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        Direccion direccion = direccionRepository
                .findByIdDireccionAndUsuario_IdUsuario(
                        request.getIdDireccionEnvio(),
                        usuario.getIdUsuario()
                )
                .orElseThrow(() -> new ApiException(
                        "La dirección no pertenece al usuario o no existe",
                        HttpStatus.BAD_REQUEST
                ));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccion(direccion);
        pedido.setEstadoPedido("PENDIENTE_PAGO");

        pedido.setNombreRecibe(direccion.getNombreRecibe());
        pedido.setTelefonoContacto(direccion.getTelefonoContacto());
        pedido.setDireccionEnvio(direccion.getDireccion());
        pedido.setCiudadEnvio(direccion.getCiudad());
        pedido.setDepartamentoEnvio(direccion.getDepartamento());

        pedido.setSubtotal(BigDecimal.ZERO);
        pedido.setCostoEnvio(COSTO_ENVIO_BASE);
        pedido.setTotal(BigDecimal.ZERO);

        Pedido savedPedido = pedidoRepository.save(pedido);

        BigDecimal subtotalPedido = BigDecimal.ZERO;

        for (PedidoItemRequest itemRequest : request.getItems()) {
            ProductoVariante variante = varianteRepository.findByIdForUpdate(itemRequest.getIdVariante())
                    .orElseThrow(() -> new ApiException("Variante no encontrada", HttpStatus.NOT_FOUND));

            if (!variante.getActivo() || !variante.getProducto().getActivo()) {
                throw new ApiException("El producto no está activo", HttpStatus.BAD_REQUEST);
            }

            if (variante.getStock() < itemRequest.getCantidad()) {
                throw new ApiException(
                        "Stock insuficiente para la variante " + variante.getSku(),
                        HttpStatus.BAD_REQUEST
                );
            }

            Diseno diseno = null;

            if (itemRequest.getIdDiseno() != null) {
                diseno = disenoRepository.findById(itemRequest.getIdDiseno())
                        .orElseThrow(() -> new ApiException("Diseño no encontrado", HttpStatus.NOT_FOUND));

                if (!"APROBADO".equals(diseno.getEstado())) {
                    throw new ApiException("El diseño seleccionado no está aprobado", HttpStatus.BAD_REQUEST);
                }
            }

            BigDecimal precioUnitario = variante.getProducto()
                    .getPrecioBase()
                    .add(variante.getPrecioAdicional());

            BigDecimal subtotalItem = precioUnitario.multiply(
                    BigDecimal.valueOf(itemRequest.getCantidad())
            );

            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(savedPedido);
            pedidoItem.setVariante(variante);
            pedidoItem.setDiseno(diseno);
            pedidoItem.setImagenPersonalizadaUrl(itemRequest.getImagenPersonalizadaUrl());
            pedidoItem.setCantidad(itemRequest.getCantidad());
            pedidoItem.setPrecioUnitario(precioUnitario);
            pedidoItem.setSubtotal(subtotalItem);
            pedidoItem.setNotasPersonalizacion(itemRequest.getNotasPersonalizacion());

            pedidoItemRepository.save(pedidoItem);

            variante.setStock(variante.getStock() - itemRequest.getCantidad());
            varianteRepository.save(variante);

            subtotalPedido = subtotalPedido.add(subtotalItem);
        }

        savedPedido.setSubtotal(subtotalPedido);
        savedPedido.setCostoEnvio(COSTO_ENVIO_BASE);
        savedPedido.setTotal(subtotalPedido.add(COSTO_ENVIO_BASE));
        savedPedido.setEstadoPedido("PAGADO");
        savedPedido.setFechaActualizacion(LocalDateTime.now());

        pedidoRepository.save(savedPedido);

        Pago pago = new Pago();
        pago.setPedido(savedPedido);
        pago.setMetodoPago(request.getMetodoPago());
        pago.setEstadoPago("APROBADO");
        pago.setReferenciaTransaccion("TPRINTS-" + UUID.randomUUID());
        pago.setValor(savedPedido.getTotal());
        pago.setFechaPago(LocalDateTime.now());
        pago.setDetalles(Map.of(
                "tipo", "pago_simulado",
                "mensaje", "Pago aprobado de forma simulada"
        ));

        pagoRepository.save(pago);

        Envio envio = new Envio();
        envio.setPedido(savedPedido);
        envio.setEmpresaEnvio("Pendiente de asignar");
        envio.setEstadoEnvio("PREPARANDO");
        envio.setCostoEnvio(COSTO_ENVIO_BASE);

        envioRepository.save(envio);

        Pedido reloaded = pedidoRepository.findById(savedPedido.getIdPedido())
                .orElseThrow();

        return toResponse(reloaded);
    }

    public List<PedidoResponse> listarMisPedidos(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        return pedidoRepository
                .findByUsuario_IdUsuarioOrderByFechaCreacionDesc(usuario.getIdUsuario())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PedidoResponse> listarTodos() {
        return pedidoRepository
                .findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PedidoResponse obtenerPorId(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new ApiException("Pedido no encontrado", HttpStatus.NOT_FOUND));

        return toResponse(pedido);
    }

    private PedidoResponse toResponse(Pedido pedido) {
        List<PedidoItemResponse> items = pedido.getItems()
                .stream()
                .map(item -> new PedidoItemResponse(
                        item.getIdPedidoItem(),
                        item.getVariante().getIdVariante(),
                        item.getVariante().getProducto().getNombre(),
                        item.getVariante().getColor(),
                        item.getVariante().getTalla(),
                        item.getDiseno() == null ? null : item.getDiseno().getIdDiseno(),
                        item.getDiseno() == null ? null : item.getDiseno().getTitulo(),
                        item.getImagenPersonalizadaUrl(),
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getSubtotal()
                ))
                .toList();

        return new PedidoResponse(
                pedido.getIdPedido(),
                pedido.getEstadoPedido(),
                pedido.getSubtotal(),
                pedido.getCostoEnvio(),
                pedido.getTotal(),
                pedido.getNombreRecibe(),
                pedido.getDireccionEnvio(),
                pedido.getCiudadEnvio(),
                pedido.getDepartamentoEnvio(),
                pedido.getFechaCreacion(),
                items
        );
    }
}