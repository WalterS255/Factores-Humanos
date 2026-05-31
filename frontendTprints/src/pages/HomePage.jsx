import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { getCurrentUser, isAuthenticated } from "../services/api.js";




const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
  </svg>
);

const IconShirt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0
         001.058 2.685l1.85.926A2.25 2.25 0 007.5 18.75V21h9v-2.25a2.25
         2.25 0 002.242-2.162l1.85-.926a2.25 2.25 0 001.058-2.685l-2.413-7.839a2.25
         2.25 0 00-2.15-1.588H15M9 3.75a3 3 0 106 0M9 3.75h6"/>
  </svg>
);

const IconPalette = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5
         0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0
         003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995
         15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146
         6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
  </svg>
);

const IconPencil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582
         16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0
         011.13-1.897l8.932-8.931z"/>
  </svg>
);

/* Tarjetas de categorías */
const CATEGORIES = [
  {
    to: "/productos",
    label: "Camisas",
    description: "Explora nuestra colección de prendas base listas para personalizar.",
    icon: <IconShirt />,
    accent: "bg-gray-900",
  },
  {
    to: "/disenos",
    label: "Estampas",
    description: "Elige entre decenas de diseños aprobados para aplicar en tu prenda.",
    icon: <IconPalette />,
    accent: "bg-[#775a19]",
  },
  {
    to: "/disenar",
    label: "Diseñar",
    description: "Sube tu propio diseño y hazlo parte del catálogo T-Prints.",
    icon: <IconPencil />,
    accent: "bg-gray-600",
  },
];

/* Pasos del proceso */
const HOW_IT_WORKS = [
  { n: "01", title: "Elige tu prenda",   desc: "Selecciona la camisa perfecta de nuestro catálogo." },
  { n: "02", title: "Aplica tu diseño",  desc: "Escoge una estampa del archivo o sube la tuya propia." },
  { n: "03", title: "Finaliza el pedido", desc: "Confirma tu orden y la enviamos directo a tu puerta." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ── Enlace de salto (WCAG 2.4.1) ───────────────────────────────── */}
      <a
        href="#inicio-contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded focus:outline focus:outline-2"
      >
        Saltar al contenido principal
      </a>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <main id="inicio-contenido" className="flex-1 pb-24">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          aria-label="Bienvenida"
          className="relative min-h-screen flex items-center justify-center
                     overflow-hidden bg-gray-900"
        >
          {/* Imagen de fondo decorativa */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <img
              alt=""
              role="presentation"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgxiWWS-ql0G1f-t5H0f399J-iuf2pVbEkGUwPl6kSsBthrQ89WbzDIKjP59mW7e3YTnt0Gy-Hwq2M0B_0pG280uXzRnpOD2icq7pUiXTAEBuwpf5ImSEfSlTUiZ0jCl0BoGiV0lCqn3KUC7vtKR8SJyRXJ1HEks2fe9NRR1uHT0VdJDVKyePFJLiVL-AfvnduwUF3hLBpIBE2n37gUh8HTLeFbPKJevEZiyDTC3edH0oHfloxEXOccOjhEeBnPB5u7RaPzvNwetE1"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80" />
          </div>

          {/* Contenido del hero */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8">
              Tu identidad, tu estampa
            </p>

            <h1
              className="text-5xl md:text-8xl text-white italic tracking-tight
                         leading-none mb-8"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Viste lo que <br />
              <span className="text-[#e9c176]">eres</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed
                          max-w-xl mx-auto mb-12">
              Diseños únicos estampados en prendas de calidad. Elige, personaliza
              y lleva tu estilo a otro nivel.
            </p>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/productos"
                className="bg-white text-gray-900 px-10 py-4 text-xs tracking-[0.2em]
                           uppercase font-semibold hover:bg-gray-100
                           transition-all duration-300 rounded-sm
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-white
                           flex items-center gap-3"
              >
                Ver colección
                <IconArrow />
              </Link>

              {!isAuthenticated() && (
                <Link
                  to="/registro"
                  className="border border-white/40 text-white px-10 py-4 text-xs
                             tracking-[0.2em] uppercase hover:bg-white/10
                             transition-all duration-300 rounded-sm
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Crear cuenta
                </Link>
              )}

              {isAuthenticated() && (
                <Link
                  to="/disenar"
                  className="border border-white/40 text-white px-10 py-4 text-xs
                             tracking-[0.2em] uppercase hover:bg-white/10
                             transition-all duration-300 rounded-sm
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Subir mi diseño
                </Link>
              )}
            </div>
          </div>

          {/* Indicador de scroll */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
               aria-hidden="true">
            <div className="w-px h-12 bg-white/30 mx-auto animate-pulse" />
          </div>
        </section>

        {/* ── SALUDO PERSONALIZADO (si hay sesión) ─────────────────────── */}
        {isAuthenticated() && user && (
          <section
            aria-label="Bienvenida personalizada"
            className="px-6 md:px-12 py-12 max-w-screen-2xl mx-auto"
          >
            <div className="border-l-2 border-[#775a19]/40 pl-6 py-2">
              <p className="text-[10px] tracking-widest uppercase text-[#775a19] mb-1">
                De vuelta
              </p>
              <p className="text-2xl text-gray-900"
                 style={{ fontFamily: "'Noto Serif', serif" }}>
                Bienvenido, {user.nombres || user.nombreUsuario} 👋
              </p>
            </div>
          </section>
        )}

        {/* ── CATEGORÍAS ───────────────────────────────────────────────── */}
        <section
          aria-label="Categorías principales"
          className="px-6 md:px-12 py-20 max-w-screen-2xl mx-auto"
        >
          <header className="mb-14">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-3">
              Explora
            </p>
            <h2
              className="text-3xl md:text-5xl tracking-tight text-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              ¿Qué quieres hacer hoy?
            </h2>
          </header>

          {/*
           * W3C: <ul>/<li> para lista de categorías (WCAG 1.3.1).
           */}
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0"
              aria-label="Accesos directos a secciones">
            {CATEGORIES.map(({ to, label, description, icon, accent }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex flex-col justify-between h-full
                             bg-white border border-gray-100 p-8
                             hover:border-gray-300 hover:shadow-sm
                             transition-all duration-300
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-gray-900
                             min-h-[220px]"
                  aria-label={`Ir a ${label}`}
                >
                  <div>
                    {/* Ícono con fondo de color */}
                    <div className={`w-10 h-10 ${accent} text-white flex items-center
                                    justify-center rounded-sm mb-6 transition-transform
                                    duration-300 group-hover:scale-110`}>
                      {icon}
                    </div>

                    <h3
                      className="text-xl text-gray-900 mb-2"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {label}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Flecha animada al hover */}
                  <div className="mt-8 flex items-center gap-2 text-[11px]
                                  tracking-widest uppercase text-gray-400
                                  group-hover:text-gray-900 transition-colors duration-300">
                    Explorar
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      <IconArrow />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CÓMO FUNCIONA ────────────────────────────────────────────── */}
        <section
          aria-label="Cómo funciona T-Prints"
          className="bg-gray-900 px-6 md:px-12 py-24"
        >
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-16 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#e9c176] mb-3">
                El proceso
              </p>
              <h2
                className="text-3xl md:text-5xl tracking-tight text-white"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Así de simple
              </h2>
            </header>

            {/*
             * W3C: <ol> para pasos ordenados (WCAG 1.3.1).
             */}
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-12 list-none p-0 m-0"
                aria-label="Pasos del proceso">
              {HOW_IT_WORKS.map(({ n, title, desc }, i) => (
                <li key={n} className="flex flex-col items-center text-center md:items-start md:text-left">
                  <span
                    className="text-6xl font-bold text-white/10 mb-4 leading-none select-none"
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  <h3
                    className="text-xl text-white mb-3"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

                  {/* Separador entre pasos (solo desktop) */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute" aria-hidden="true"/>
                  )}
                </li>
              ))}
            </ol>

            {/* CTA centrado */}
            <div className="mt-16 text-center">
              <Link
                to="/productos"
                className="inline-flex items-center gap-3 bg-[#e9c176] text-gray-900
                           px-10 py-4 text-xs tracking-[0.2em] uppercase font-semibold
                           hover:bg-[#fed488] transition-all duration-300 rounded-sm
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-[#e9c176]"
              >
                Empezar ahora
                <IconArrow />
              </Link>
            </div>
          </div>
        </section>

        {/* ── ACCESO RÁPIDO (sin sesión) ────────────────────────────────── */}
        {!isAuthenticated() && (
          <section
            aria-label="Unirse a T-Prints"
            className="px-6 md:px-12 py-24 max-w-screen-2xl mx-auto text-center"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-4">
              Únete
            </p>
            <h2
              className="text-3xl md:text-5xl tracking-tight text-gray-900 mb-6"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Crea tu cuenta gratis
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
              Regístrate para guardar tus diseños favoritos, hacer pedidos y
              subir tus propias creaciones al catálogo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/registro"
                className="bg-gray-900 text-white px-10 py-4 text-xs tracking-[0.2em]
                           uppercase hover:bg-gray-700 transition-all duration-300
                           rounded-sm focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="text-[11px] tracking-widest uppercase text-gray-900
                           border-b border-gray-300 pb-0.5 hover:border-gray-900
                           transition-all duration-300
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900 rounded"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </section>
        )}

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer
          className="bg-[#f5f3ee] px-6 md:px-12 py-10 border-t border-gray-100"
          aria-label="Pie de página"
        >
          <div className="flex flex-col md:flex-row justify-between items-center
                          max-w-screen-2xl mx-auto gap-6">
            <span
              className="text-lg tracking-tighter text-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              T-PRINTS
            </span>
            <nav aria-label="Vínculos legales" className="flex gap-8">
              {["Privacidad", "Términos", "Contacto"].map((l) => (
                <span key={l}
                      className="text-[10px] tracking-widest uppercase text-gray-400">
                  {l}
                </span>
              ))}
            </nav>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 opacity-60">
              © 2026 T-PRINTS. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}
