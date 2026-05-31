import { Link } from "react-router-dom";

/**
 * NotFoundPage — 404 con sistema editorial T-Prints.
 *   • WAI-ARIA 1.2: landmarks, roles, labels
 *   • WCAG 2.1 AA: semántica, foco visible, contraste
 *   • W3C HTML5: <main>, <header>
 */
export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-[#fbf9f4] flex flex-col"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Barra superior */}
      <header className="w-full px-6 md:px-12 py-5 border-b border-gray-100">
        <span
          className="text-xl tracking-tighter text-gray-900 select-none"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          T-PRINTS
        </span>
      </header>

      {/* Contenido principal */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-6 text-center"
        aria-labelledby="titulo-404"
      >
        {/* Número grande decorativo */}
        <p
          className="text-[10rem] md:text-[14rem] font-bold leading-none
                     text-gray-100 select-none"
          aria-hidden="true"
        >
          404
        </p>

        {/* Separador editorial */}
        <div className="w-16 h-px bg-[#775a19] mx-auto -mt-6 mb-8" aria-hidden="true" />

        <h1
          id="titulo-404"
          className="text-3xl md:text-5xl tracking-tight text-gray-900 mb-4"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          Página no encontrada
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-10">
          La ruta que buscas no existe o fue movida. Puedes volver al inicio
          o explorar el catálogo de productos.
        </p>

        {/* Acciones */}
        <nav aria-label="Opciones de navegación" className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/productos"
            className="bg-gray-900 text-white px-10 py-4 text-xs tracking-[0.2em]
                       uppercase hover:bg-gray-700 transition-all duration-300
                       rounded-sm focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Ver productos
          </Link>

          <Link
            to="/"
            className="text-[11px] tracking-widest uppercase text-gray-900
                       border-b border-gray-300 pb-0.5 hover:border-gray-900
                       transition-all duration-300 flex items-center gap-2
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-gray-900 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            Volver al inicio
          </Link>
        </nav>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 py-6 border-t border-gray-100"
              aria-label="Pie de página">
        <p className="text-[10px] tracking-widest uppercase text-gray-400 text-center">
          © 2024 T-PRINTS. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
