import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { createOrder } from "../services/orderService.js";
import { isAuthenticated } from "../services/api.js";

const CART_STORAGE_KEY = "tprints-cart";
const SHIPPING_COST = 8000;

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStoredCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("No se pudo leer el carrito", error);
    return [];
  }
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [idDireccionEnvio, setIdDireccionEnvio] = useState("");
  const [metodoPago, setMetodoPago] = useState("PSE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    setCartItems(getStoredCart());
  }, []);

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
    const updatedCart = cartItems.map((item) =>
      item.idVariante === idVariante ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const removeItem = (idVariante) => {
    const updatedCart = cartItems.filter((item) => item.idVariante !== idVariante);
    setCartItems(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!idDireccionEnvio) {
      setError("Debes ingresar el ID de la dirección de envío.");
      return;
    }

    if (!cartItems.length) {
      setError("El carrito está vacío.");
      return;
    }

    const payload = {
      idDireccionEnvio: Number(idDireccionEnvio),
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
      setSuccess(`Pedido #${pedido.idPedido} creado correctamente. Total: ${formatCurrency(pedido.total)}`);
    } catch (error) {
      setError(error.message || "No se pudo crear el pedido");
    } finally {
      setLoadingOrder(false);
    }
  };

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
                          onClick={() => updateQuantity(item.idVariante, Number(item.quantity || 1) - 1)}
                          className="grid h-9 w-9 place-items-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="grid h-9 min-w-10 place-items-center px-3 text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.idVariante, Number(item.quantity || 1) + 1)}
                          className="grid h-9 w-9 place-items-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          +
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
              <label className="block">
                <span className="text-xs tracking-widest uppercase text-gray-500 font-semibold">
                  ID dirección de envío
                </span>
                <input
                  value={idDireccionEnvio}
                  onChange={(e) => setIdDireccionEnvio(e.target.value)}
                  type="number"
                  min="1"
                  placeholder="Ej: 1"
                  className="mt-2 h-11 w-full border border-gray-200 bg-gray-50 px-3 text-sm
                             outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 rounded-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs tracking-widest uppercase text-gray-500 font-semibold">
                  Método de pago
                </span>
                <select
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
              </label>
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
