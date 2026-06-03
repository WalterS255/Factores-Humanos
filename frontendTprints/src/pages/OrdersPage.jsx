import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { createOrder } from "../services/orderService.js";
import { isAuthenticated } from "../services/api.js";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
} from "../services/addressService.js";

const CART_STORAGE_KEY = "tprints-cart";
const SHIPPING_COST = 8000;

const EMPTY_FORM = {
  nombreRecibe: "",
  telefonoContacto: "",
  direccion: "",
  ciudad: "",
  departamento: "",
  codigoPostal: "",
  indicaciones: "",
  esPrincipal: false,
};

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStoredCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// ── Modal base con overlay animado ───────────────────────────────────────────
function Modal({ children, onClose, label }) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#1b1c19]/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="relative w-full sm:max-w-lg bg-[#fbf9f4] shadow-2xl
                   rounded-t-2xl sm:rounded-sm border-t border-gray-200 sm:border
                   max-h-[90dvh] overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}

// ── Modal para crear una nueva dirección ──────────────────────────────────────
function AddressModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const nueva = await createAddress(form);
      onSaved(nueva);
    } catch (err) {
      setError(err.message || "No se pudo guardar la dirección");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} label="Nueva dirección de envío">
      {/* Encabezado */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#775a19] font-semibold mb-1">
            Envío
          </p>
          <h3
            className="text-2xl text-[#1b1c19] leading-tight"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Nueva dirección
          </h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200
                     text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Cuerpo */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {error && (
          <div className="flex items-start gap-3 rounded-sm bg-red-50 border border-red-200 px-4 py-3">
            <svg className="mt-0.5 shrink-0 text-red-500" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre de quien recibe" name="nombreRecibe" value={form.nombreRecibe} onChange={handleChange} required />
          <Field label="Teléfono de contacto" name="telefonoContacto" value={form.telefonoContacto} onChange={handleChange} placeholder="Ej: 3001234567" />
        </div>

        <Field label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Calle, número, apartamento…" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} required />
          <Field label="Departamento" name="departamento" value={form.departamento} onChange={handleChange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Código postal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
          <Field label="Indicaciones / Barrio" name="indicaciones" value={form.indicaciones} onChange={handleChange} placeholder="Barrio, referencia…" />
        </div>

        {/* Checkbox principal */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`relative h-5 w-5 shrink-0 rounded border transition-colors
            ${form.esPrincipal ? "bg-[#1b1c19] border-[#1b1c19]" : "border-gray-300 bg-white group-hover:border-gray-500"}`}>
            {form.esPrincipal && (
              <svg className="absolute inset-0 m-auto text-white" width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <input
              type="checkbox"
              name="esPrincipal"
              checked={form.esPrincipal}
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Establecer como dirección principal</p>
            <p className="text-xs text-gray-400">Se seleccionará automáticamente al hacer pedidos</p>
          </div>
        </label>

        {/* Acciones */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 text-xs tracking-widest
                       uppercase py-3 rounded-sm hover:bg-gray-100 transition-colors"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#1b1c19] text-white text-xs tracking-widest uppercase
                       py-3 rounded-sm hover:bg-gray-700 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Guardando…
              </>
            ) : "Guardar dirección"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Modal de confirmación para eliminar ───────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel} label="Confirmar acción">
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex items-center justify-between">
        <h3
          className="text-2xl text-[#1b1c19]"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          Confirmar
        </h3>
        <button
          onClick={onCancel}
          aria-label="Cerrar"
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200
                     text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="px-6 py-6">
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 text-xs tracking-widest
                       uppercase py-3 rounded-sm hover:bg-gray-100 transition-colors"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white text-xs tracking-widest uppercase
                       py-3 rounded-sm hover:bg-red-700 transition-colors"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, name, value, onChange, required, placeholder }) {
  const inputId = `field-${name}`;
  return (
    <div className="block">
      <label
        htmlFor={inputId}
        className="text-xs tracking-wide text-gray-500 font-semibold uppercase"
      >
        {label}{required && <span className="text-[#775a19] ml-0.5" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (obligatorio)</span>}
      </label>
      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        aria-required={required ? "true" : undefined}
        className="mt-1.5 h-11 w-full border border-gray-200 bg-white px-3 text-sm text-gray-900
                   placeholder:text-gray-300 outline-none rounded-sm
                   focus:border-[#1b1c19] focus:ring-2 focus:ring-[#1b1c19]/10 transition-colors"
      />
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function OrdersPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [metodoPago, setMetodoPago] = useState("PSE");
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // id a eliminar
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setCartItems(getStoredCart());
    if (isAuthenticated()) fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await getMyAddresses();
      setAddresses(data);
      // Pre-seleccionar la dirección principal si existe
      const principal = data.find((d) => d.esPrincipal);
      if (principal) setSelectedAddressId(String(principal.idDireccion));
      else if (data.length === 1) setSelectedAddressId(String(data[0].idDireccion));
    } catch {
      // silencioso — el usuario verá el botón para agregar
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressSaved = (nueva) => {
    setAddresses((prev) => {
      const sinPrincipal = nueva.esPrincipal
        ? prev.map((d) => ({ ...d, esPrincipal: false }))
        : prev;
      return [...sinPrincipal, nueva];
    });
    setSelectedAddressId(String(nueva.idDireccion));
    setShowModal(false);
  };

  const handleDeleteAddress = async (id) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((d) => d.idDireccion !== id));
      if (selectedAddressId === String(id)) setSelectedAddressId("");
    } catch (err) {
      setError(err.message || "No se pudo eliminar la dirección");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const shipping = cartItems.length ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const updateQuantity = (idVariante, nextQuantity) => {
    const quantity = Math.max(1, nextQuantity);
    const updated = cartItems.map((item) =>
      item.idVariante === idVariante ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  };

  const removeItem = (idVariante) => {
    const updated = cartItems.filter((item) => item.idVariante !== idVariante);
    setCartItems(updated);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (!selectedAddressId) {
      setError("Debes seleccionar o agregar una dirección de envío.");
      return;
    }
    if (!cartItems.length) {
      setError("El carrito está vacío.");
      return;
    }

    const payload = {
      idDireccionEnvio: Number(selectedAddressId),
      metodoPago,
      items: cartItems.map((item) => ({
        idVariante: item.idVariante,
        cantidad: Number(item.quantity || 1),
        imagenPersonalizadaUrl: item.imagenPersonalizadaUrl || null,
        notasPersonalizacion: item.notasPersonalizacion || null,
      })),
    };

    try {
      setLoadingOrder(true);
      const pedido = await createOrder(payload);
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);
      setSuccess(
        `Pedido #${pedido.idPedido} creado correctamente. Total: ${formatCurrency(pedido.total)}`
      );
    } catch (err) {
      setError(err.message || "No se pudo crear el pedido");
    } finally {
      setLoadingOrder(false);
    }
  };

  const selectedAddress = addresses.find(
    (d) => String(d.idDireccion) === selectedAddressId
  );

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <a
        href="#carrito-contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded focus:outline focus:outline-2"
      >
        Saltar al contenido principal
      </a>

      {showModal && (
        <AddressModal
          onClose={() => setShowModal(false)}
          onSaved={handleAddressSaved}
        />
      )}

      {confirmDelete !== null && (
        <ConfirmModal
          message="¿Estás seguro de que quieres eliminar esta dirección? Esta acción no se puede deshacer."
          onConfirm={() => handleDeleteAddress(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <main
        id="carrito-contenido"
        className="flex-1 pt-8 pb-28 px-6 md:px-12 max-w-screen-2xl mx-auto w-full"
      >
        <header className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1
              className="text-4xl md:text-6xl tracking-tight leading-tight text-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Carrito de compras
            </h1>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              Revisa los productos agregados antes de finalizar tu compra.
            </p>
          </div>

          <Link
            to="/productos"
            className="inline-flex items-center justify-center gap-2 border border-gray-900
                       text-gray-900 text-xs tracking-widest uppercase py-3 px-5
                       hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-sm"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Seguir comprando
          </Link>
        </header>

        {success && (
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] items-start">

          {/* ── Lista de items ── */}
          <section aria-label="Productos en el carrito">
            {cartItems.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center
                              border-2 border-dashed border-gray-200 bg-white p-8 text-center rounded-sm">
                <h2 className="text-lg font-bold text-gray-800">Tu carrito está vacío</h2>
                <p className="mt-2 max-w-md text-sm text-gray-400">
                  Agrega una camisa desde productos para que aparezca aquí con su imagen,
                  descripción y cantidad.
                </p>
                <Link
                  to="/productos"
                  className="mt-6 inline-flex items-center justify-center gap-2 bg-gray-900
                             text-white text-xs tracking-widest uppercase py-3 px-6 rounded-sm
                             hover:bg-gray-700 transition-all duration-300"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <article
                    key={item.idVariante}
                    className="grid gap-4 bg-white border border-gray-100 p-4 rounded-sm
                               sm:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="h-32 overflow-hidden rounded-sm bg-gray-100 sm:h-28">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">{item.name}</h2>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Variante: {item.color} / Talla {item.size}
                        </p>
                        <p className="mt-2 text-sm font-bold text-[#775a19]">
                          {formatCurrency(Number(item.price || 0))}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.idVariante)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                        className="w-fit text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:justify-center">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Cantidad
                      </p>
                      <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
                        <button
                          onClick={() =>
                            updateQuantity(item.idVariante, Number(item.quantity || 1) - 1)
                          }
                          aria-label={`Disminuir cantidad de ${item.name}`}
                          className="grid h-9 w-9 place-items-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <span aria-hidden="true">-</span>
                        </button>
                        <span
                          className="grid h-9 min-w-10 place-items-center px-3 text-sm font-bold"
                          aria-live="polite"
                          aria-label={`Cantidad de ${item.name}: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.idVariante, Number(item.quantity || 1) + 1)
                          }
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          className="grid h-9 w-9 place-items-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── Resumen de compra ── */}
          <aside
            aria-label="Resumen de compra"
            className="bg-white border border-gray-100 p-6 rounded-sm lg:sticky lg:top-8"
          >
            <h2
              className="text-2xl text-gray-900 mb-6"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Resumen de compra
            </h2>

            <div className="space-y-4 mb-6">

              {/* ── Selector de dirección ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-widest uppercase text-gray-500 font-semibold">
                    Dirección de envío
                  </span>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-xs text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
                  >
                    + Nueva
                  </button>
                </div>

                {loadingAddresses ? (
                  <p className="text-xs text-gray-400 py-2">Cargando direcciones…</p>
                ) : addresses.length === 0 ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full border-2 border-dashed border-gray-200 rounded-sm py-4
                               text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Agregar dirección de envío
                  </button>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.idDireccion}
                        className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors
                          ${
                            selectedAddressId === String(addr.idDireccion)
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                      >
                        <input
                          type="radio"
                          name="direccion"
                          value={addr.idDireccion}
                          checked={selectedAddressId === String(addr.idDireccion)}
                          onChange={() => setSelectedAddressId(String(addr.idDireccion))}
                          className="mt-0.5 accent-gray-900"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {addr.nombreRecibe}
                            {addr.esPrincipal && (
                              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider
                                               text-[#775a19] bg-amber-50 px-1.5 py-0.5 rounded">
                                Principal
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {addr.direccion}, {addr.ciudad}
                          </p>
                          {addr.departamento && (
                            <p className="text-xs text-gray-400">{addr.departamento}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmDelete(addr.idDireccion);
                          }}
                          disabled={deletingId === addr.idDireccion}
                          className="grid h-7 w-7 place-items-center rounded-full text-gray-300
                                     hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                          aria-label="Eliminar dirección"
                        >
                          {deletingId === addr.idDireccion ? (
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          )}
                        </button>
                      </label>
                    ))}
                  </div>
                )}

                {/* Preview de la dirección seleccionada */}
                {selectedAddress && (
                  <div className="mt-2 rounded-sm bg-gray-50 border border-gray-100 px-3 py-2 text-xs text-gray-500">
                    {selectedAddress.telefonoContacto && (
                      <p>Tel: {selectedAddress.telefonoContacto}</p>
                    )}
                    {selectedAddress.indicaciones && (
                      <p>Ref: {selectedAddress.indicaciones}</p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Método de pago ── */}
              <div className="block">
                <label
                  htmlFor="metodo-pago"
                  className="text-xs tracking-widest uppercase text-gray-500 font-semibold"
                >
                  Método de pago
                </label>
                <select
                  id="metodo-pago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mt-2 h-11 w-full border border-gray-200 bg-gray-50 px-3 text-sm
                             outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 rounded-sm"
                >
                  <option value="PSE">PSE</option>
                  <option value="TARJETA">Tarjeta</option>
                  <option value="NEQUI">Nequi</option>
                  <option value="DAVIPLATA">Daviplata</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="EFECTIVO">Efectivo</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-5 pb-5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Productos</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span
                className="text-xl font-extrabold text-[#775a19]"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {formatCurrency(total)}
              </span>
            </div>

            <button
              disabled={!cartItems.length || loadingOrder}
              onClick={handleCreateOrder}
              className="mt-6 w-full bg-gray-900 text-white text-xs tracking-widest uppercase
                         py-3 px-4 rounded-sm hover:bg-gray-700 transition-all duration-300
                         disabled:cursor-not-allowed disabled:bg-gray-300"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              {loadingOrder ? "Creando pedido..." : "Finalizar compra"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              El envío se calcula con una tarifa base de {formatCurrency(SHIPPING_COST)}.
            </p>
          </aside>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
