import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { getProducts } from "../services/productService.js";


const CART_STORAGE_KEY = "tprints-cart";

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

function normalizeProducts(productsFromBackend) {
  return productsFromBackend.flatMap((product) =>
    (product.variantes || [])
      .filter((v) => v.activo)
      .map((variant) => ({
        id: variant.idVariante,
        idProducto: product.idProducto,
        idVariante: variant.idVariante,
        name: product.nombre,
        description: product.descripcion,
        color: variant.color,
        size: variant.talla,
        stock: variant.stock,
        sku: variant.sku,
        price: Number(product.precioBase || 0) + Number(variant.precioAdicional || 0),
        image: variant.imagenUrl,
      }))
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const productCards = useMemo(() => normalizeProducts(products), [products]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = (product) => {
    const cart = getStoredCart();
    const existing = cart.find((i) => i.idVariante === product.idVariante);

    const updated = existing
      ? cart.map((i) =>
          i.idVariante === product.idVariante
            ? { ...i, quantity: Number(i.quantity || 1) + 1 }
            : i
        )
      : [
          ...cart,
          {
            id: product.idVariante,
            idProducto: product.idProducto,
            idVariante: product.idVariante,
            name: product.name,
            description: `${product.description || ""} Color: ${product.color} - Talla: ${product.size}`,
            color: product.color,
            size: product.size,
            quantity: 1,
            price: product.price,
            image: product.image,
            stock: product.stock,
            sku: product.sku,
          },
        ];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    alert(`${product.name} ${product.color} talla ${product.size} fue agregado al carrito`);
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >

      {/* ── Enlace de salto (WCAG 2.4.1) ───────────────────────────────── */}
      <a
        href="#productos-grid"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded
                   focus:outline focus:outline-2"
      >
        Saltar al catálogo de productos
      </a>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 pt-8 pb-28 px-6 md:px-12 max-w-screen-2xl mx-auto w-full">

        {/* ── Encabezado editorial ─────────────────────────────────────── */}
        <header className="mb-14">
          <h1
            className="text-4xl md:text-6xl tracking-tight leading-tight mb-5 text-gray-900"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Colección de Camisas
          </h1>
          <p className="text-base text-gray-500 max-w-xl leading-relaxed italic
                        border-l border-gray-200 pl-5 py-1">
            Cada prenda es una declaración. Diseños pensados para destacar,
            con calidad que perdura.
          </p>
        </header>

        {/* ── Estado: cargando ─────────────────────────────────────────── */}
        {/*
         * aria-live="polite": anuncia cambios de estado sin interrumpir
         * (WCAG 4.1.3).
         */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 py-12 justify-center text-gray-400 text-sm"
          >
            {/* Spinner SVG — sin dependencia de fuente */}
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"
                 fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Cargando productos…
          </div>
        )}

        {/* ── Estado: error ─────────────────────────────────────────────── */}
        {/*
         * role="alert": anuncia el error inmediatamente (WCAG 4.1.3).
         */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-lg border border-red-200 bg-red-50 px-5 py-4
                       text-sm font-medium text-red-700 mb-8"
          >
            {error}
          </div>
        )}

        {/* ── Estado: sin productos ─────────────────────────────────────── */}
        {!loading && !error && productCards.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-16">
            No hay productos disponibles en este momento.
          </p>
        )}

        {/* ══════════════════════════════════════════════════════════════
            GRID DE PRODUCTOS
            W3C: <ul>/<li> para lista de productos (WCAG 1.3.1).
            id="productos-grid" destino del enlace de salto.
        ══════════════════════════════════════════════════════════════ */}
        <ul
          id="productos-grid"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 list-none p-0 m-0"
          aria-label="Catálogo de productos"
        >
          {productCards.map((p) => (
            <li key={p.idVariante} className="group">

              {/* ── Imagen del producto ──────────────────────────────── */}
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4
                              relative transition-all duration-700
                              group-hover:bg-gray-50">

                {p.image ? (
                  <img
                    src={p.image}
                    /*
                     * WCAG 1.1.1: alt descriptivo con nombre, color y talla.
                     */
                    alt={`${p.name} — ${p.color}, talla ${p.size}`}
                    className="w-full h-full object-cover mix-blend-multiply
                               opacity-90 group-hover:scale-105
                               transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  /* Placeholder cuando no hay imagen */
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16
                           16m-2-2l1.586-1.586a2 2 0 012.828
                           0L20 14m-6-6h.01M6 20h12a2 2 0
                           002-2V6a2 2 0 00-2-2H6a2 2 0 00-2
                           2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}


                {/* Badge sin stock */}
                {p.stock <= 0 && (
                  <div
                    className="absolute bottom-0 left-0 w-full bg-gray-900/70
                               text-white text-[10px] tracking-widest uppercase
                               text-center py-2"
                    aria-label="Producto agotado"
                  >
                    Agotado
                  </div>
                )}
              </div>

              {/* ── Info del producto ────────────────────────────────── */}
              {/*
               * W3C: <article> para contenido independiente y autocontenido
               * (WCAG 1.3.1).
               */}
              <article aria-label={p.name}>
                <div className="flex flex-col gap-1">
                  <h2
                    className="text-lg leading-snug text-gray-900"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {p.name}
                  </h2>

                  {/* Color y talla */}
                  <p className="text-[11px] uppercase tracking-widest text-gray-400">
                    {p.color}
                    {p.size && ` | Talla ${p.size}`}
                  </p>

                  {/* Stock */}
                  <p className="text-[11px] text-gray-400">
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
                  </p>
                </div>

                {/* Precio + botón agregar al carrito */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-[#775a19] font-semibold">
                    {formatCurrency(p.price)}
                  </p>

                  {/*
                   * WCAG 4.1.2: aria-label describe la acción y el producto.
                   * disabled cuando sin stock.
                   * SVG inline — sin dependencia de Material Symbols font.
                   */}
                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={p.stock <= 0}
                    aria-label={`Agregar ${p.name} talla ${p.size} al carrito`}
                    className="flex items-center justify-center w-8 h-8 rounded-full
                               border border-gray-200 text-gray-700
                               hover:bg-gray-900 hover:text-white hover:border-gray-900
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all duration-300
                               focus-visible:outline focus-visible:outline-2
                               focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                  >
                    {/* Ícono + con SVG puro */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          PIE DE PÁGINA
          W3C: <footer> con role="contentinfo" implícito.
          Solo visible en desktop; en móvil el BottomNav ocupa ese espacio.
      ══════════════════════════════════════════════════════════════════ */}
      <footer
        className="hidden md:block bg-[#f5f3ee] w-full"
        aria-label="Pie de página"
      >
        <div className="flex flex-col md:flex-row justify-between items-center
                        w-full px-12 py-12 gap-8 max-w-screen-2xl mx-auto">
          <span
            className="text-lg tracking-tighter text-gray-900"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            T-PRINTS
          </span>

          <nav aria-label="Vínculos legales" className="flex flex-wrap gap-8">
            {["Privacidad", "Términos", "Envíos y devoluciones"].map((label) => (
              <span
                key={label}
                className="text-[10px] tracking-widest uppercase text-gray-400"
              >
                {label}
              </span>
            ))}
          </nav>

          <p className="text-[10px] tracking-widest uppercase text-gray-400 opacity-60">
            © 2026 T-PRINTS. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* BottomNav — navegación móvil fija en la parte inferior */}
      <BottomNav />
    </div>
  );
}
