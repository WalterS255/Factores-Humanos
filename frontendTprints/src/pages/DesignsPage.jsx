import { NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { designs, getStatusBadgeClasses } from "../data/designs.js";
import BottomNav from "../components/BottomNav.jsx";


export default function DesignsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return designs;
    return designs.filter((d) =>
      (d.title + " " + d.subtitle).toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ── Enlace de salto (WCAG 2.4.1) ───────────────────────────────── */}
      <a
        href="#disenos-grid"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded
                   focus:outline focus:outline-2"
      >
        Saltar al catálogo de diseños
      </a>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 pt-8 pb-28 px-6 md:px-12 max-w-screen-2xl mx-auto w-full">

        {/* ── Encabezado editorial ─────────────────────────────────────── */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1
              className="text-4xl md:text-6xl tracking-tighter leading-tight mb-4 text-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Selección de Estampas
            </h1>
            <p className="text-gray-500 max-w-xl text-base leading-relaxed">
              Un archivo curado de diseños disponibles para estampar en tu prenda.
              Cada pieza es una expresión única, lista para aplicar.
            </p>
          </div>

          {/* ── Buscador ─────────────────────────────────────────────────
              WCAG 1.3.1: label visible + htmlFor/id asociados.
              WCAG 2.4.3: foco visible en el input.
          ─────────────────────────────────────────────────────────────── */}
          <div className="w-full md:w-72">
            <label htmlFor="buscar-disenos" className="sr-only">
              Buscar diseños
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
              </span>
              <input
                id="buscar-disenos"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar diseños…"
                aria-label="Buscar diseños por nombre o descripción"
                className="w-full bg-white border border-gray-200 py-3 pl-9 pr-4
                           text-sm text-gray-900 placeholder:text-gray-400
                           focus:border-gray-900 focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-gray-900
                           transition-all duration-300 rounded-sm"
              />
            </div>
          </div>
        </header>

        {/* ── Banner "Próximamente" ─────────────────────────────────────── */}
        <div className="mb-10 flex items-center gap-4 border border-[#775a19]/30
                        bg-[#775a19]/5 px-6 py-4 rounded-sm">
          <div className="shrink-0 w-2 h-2 rounded-full bg-[#775a19] animate-pulse" aria-hidden="true" />
          <p className="text-sm text-[#775a19] font-medium">
            Estamos preparando algo especial —
            <span className="font-bold"> la selección de estampas estará disponible muy pronto.</span>
          </p>
        </div>

        <aside
          role="note"
          aria-label="Instrucción previa al diseño"
          className="mb-14 flex flex-col sm:flex-row items-start sm:items-center
                     justify-between gap-5 border border-gray-200 bg-gray-50 p-6"
        >
          <div className="flex items-start gap-4">
            {/* Ícono informativo SVG */}
            <div className="mt-0.5 text-gray-500 shrink-0" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75
                     0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
              </svg>
            </div>
            <div>
              <p className="text-gray-900 text-sm font-semibold mb-1">
                Primero debes seleccionar una camisa
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Para aplicar un diseño a tu pedido, elige una prenda base de nuestro catálogo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="shrink-0 bg-gray-900 text-white text-xs tracking-widest uppercase
                       px-6 py-3 hover:bg-gray-700 transition-all duration-300
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-gray-900
                       rounded-sm whitespace-nowrap"
          >
            Ir a seleccionar camisa
          </button>
        </aside>

        {/* ── Sin resultados ────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-gray-400 text-sm py-16"
          >
            No se encontraron diseños para "{query}".
          </p>
        )}

        {/* ══════════════════════════════════════════════════════════════
            GRID ASIMÉTRICO EDITORIAL
            W3C: <ul>/<li> para lista de diseños (WCAG 1.3.1).
            El primer elemento ocupa dos columnas en desktop para generar
            jerarquía visual editorial (inspirado en el HTML de referencia).
        ══════════════════════════════════════════════════════════════ */}
        <ul
          id="disenos-grid"
          className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-10 items-start list-none p-0 m-0"
          aria-label="Catálogo de diseños"
        >
          {filtered.map((d, index) => {
            const badge = getStatusBadgeClasses(d.statusTone);

            /* Primer elemento: ancho completo en desktop (col-span-8) */
            const isFeatured = index === 0 && filtered.length > 1;
            const colClass = isFeatured
              ? "md:col-span-8"
              : index === 1 && filtered.length > 1
              ? "md:col-span-4 md:mt-16"
              : "md:col-span-4";

            const aspectClass = isFeatured ? "aspect-[16/9]" : "aspect-[3/4]";

            return (
              <li key={d.id} className={`group cursor-pointer ${colClass}`}>

                {/* Imagen */}
                <div
                  className={`relative overflow-hidden bg-gray-100 ${aspectClass}
                              transition-all duration-700 group-hover:bg-gray-50`}
                >
                  <img
                    src={d.image}
                    /*
                     * WCAG 1.1.1: alt descriptivo con título y subtítulo.
                     */
                    alt={`${d.title} — ${d.subtitle}`}
                    className="w-full h-full object-contain p-6 transition-transform
                               duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  {/* Overlay sutil al hover */}
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/5
                                  transition-colors duration-700 pointer-events-none" />

                  {/* Badge de estado
                      WCAG 1.4.1: no solo color para indicar estado; también texto.
                  */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px]
                                  font-bold uppercase tracking-wider rounded-sm
                                  ${badge.wrapper} ${badge.text}`}
                      aria-label={`Estado: ${d.status}`}
                    >
                      {/* Punto de color refuerza el estado visualmente */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full inline-block
                          ${d.statusTone === "green" ? "bg-green-500" : "bg-orange-500"}`}
                        aria-hidden="true"
                      />
                      {d.status}
                    </span>
                  </div>
                </div>

                {/* Info del diseño */}
                <article aria-label={d.title} className="mt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] font-bold uppercase
                                  text-[#775a19] mb-2">
                      {d.subtitle}
                    </p>
                    <h2
                      className={`text-gray-900 ${isFeatured ? "text-3xl" : "text-xl"}`}
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {d.title}
                    </h2>
                  </div>

                  {/* Botón "Ver diseño" — SVG, sin texto de ícono suelto */}
                  <button
                    type="button"
                    aria-label={`Ver diseño ${d.title}`}
                    className="flex items-center gap-2 text-gray-900 text-[11px]
                               tracking-widest uppercase border-b border-gray-200
                               pb-0.5 hover:border-gray-900 transition-all duration-300
                               focus-visible:outline focus-visible:outline-2
                               focus-visible:outline-offset-2 focus-visible:outline-gray-900
                               shrink-0 ml-4"
                  >
                    Ver
                    {/* Flecha SVG — sin dependencia de fuente */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                  </button>
                </article>
              </li>
            );
          })}
        </ul>

        {/* ══════════════════════════════════════════════════════════════
            CTA: SUBIR DISEÑO PERSONALIZADO
            Mantiene funcionalidad del botón original.
            Estilizado como la tarjeta CTA del HTML de referencia.
        ══════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Subir diseño propio"
          className="mt-24 border-t border-gray-100 pt-20"
        >
          <div
            className="bg-gray-50 p-10 md:p-16 flex flex-col md:flex-row
                       items-center justify-between gap-10 border-l-2 border-[#775a19]/20
                       relative overflow-hidden group"
          >
            {/* Elemento decorativo de fondo */}
            <div
              className="absolute -right-16 -bottom-16 w-64 h-64 border
                         border-[#775a19]/10 rounded-full group-hover:scale-110
                         transition-transform duration-1000 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-lg">
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase
                               text-[#775a19] mb-4 block">
                Diseño personalizado
              </span>
              <h2
                className="text-3xl md:text-4xl text-gray-900 mb-5 leading-tight"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Sube tu propio diseño
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                ¿Tienes una idea propia? Sube tu archivo y nuestro equipo lo
                revisará para aplicarlo a tu prenda personalizada.
              </p>
            </div>

            <button
              type="button"
              aria-label="Subir un diseño personalizado"
              className="relative z-10 bg-gray-900 text-white px-10 py-4 text-xs
                         tracking-widest uppercase hover:bg-gray-700
                         transition-all duration-300 rounded-sm shrink-0
                         inline-flex items-center gap-3
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              {/* Ícono upload SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0
                     0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              Subir diseño personalizado
            </button>
          </div>
        </section>

        {/* ── Footer editorial (desktop) ───────────────────────────────── */}
        <footer
          className="hidden md:flex flex-col md:flex-row justify-between items-center
                     mt-20 pt-10 border-t border-gray-100 gap-6"
          aria-label="Pie de página"
        >
          <span
            className="text-lg tracking-tighter text-gray-900"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            T-PRINTS
          </span>
          <nav aria-label="Vínculos legales" className="flex gap-8">
            {["Privacidad", "Términos", "Contacto"].map((label) => (
              <span key={label}
                    className="text-[10px] tracking-widest uppercase text-gray-400">
                {label}
              </span>
            ))}
          </nav>
          <p className="text-[10px] tracking-widest uppercase text-gray-400 opacity-60">
            © 2026 T-PRINTS. Todos los derechos reservados.
          </p>
        </footer>
      </main>

      {/* BottomNav — navegación móvil */}
      <BottomNav />
    </div>
  );
}
