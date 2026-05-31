import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService.js";


export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword]   = useState(false);
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword]           = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ identificador, password });
      navigate("/productos");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    /*
     * W3C: <main> como landmark principal de la página.
     * WAI-ARIA: role="main" implícito en <main>; evita duplicar el landmark
     * con un <div> extra.
     */
    <main className="flex min-h-screen w-full flex-col md:flex-row"
          style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ── Enlace de salto (WCAG 2.4.1 – Bypass Blocks) ──────────────── */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
                   focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold
                   focus:text-gray-900 focus:rounded focus:outline focus:outline-2"
      >
        Saltar al formulario de inicio de sesión
      </a>

      {/* ── Panel izquierdo: visual decorativo ─────────────────────────── */}
      {/*
       * WAI-ARIA: aria-hidden="true" porque el panel es puramente decorativo.
       * WCAG 1.1.1: la imagen de fondo también tiene aria-hidden; no aporta
       * información al contenido.
       */}
      <section
        aria-hidden="true"
        className="relative hidden md:flex md:w-1/2 lg:w-3/5 h-screen
                   items-center justify-center bg-gray-900 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            role="presentation"
            className="w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgxiWWS-ql0G1f-t5H0f399J-iuf2pVbEkGUwPl6kSsBthrQ89WbzDIKjP59mW7e3YTnt0Gy-Hwq2M0B_0pG280uXzRnpOD2icq7pUiXTAEBuwpf5ImSEfSlTUiZ0jCl0BoGiV0lCqn3KUC7vtKR8SJyRXJ1HEks2fe9NRR1uHT0VdJDVKyePFJLiVL-AfvnduwUF3hLBpIBE2n37gUh8HTLeFbPKJevEZiyDTC3edH0oHfloxEXOccOjhEeBnPB5u7RaPzvNwetE1"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-40" />
        </div>

        <div className="relative z-10 text-center px-12">
          <p className="text-gray-300 tracking-[0.5em] uppercase text-xs mb-6"
             style={{ fontFamily: "'Manrope', sans-serif" }}>
            Tu tienda de estampados
          </p>
          <h1 className="text-5xl lg:text-7xl text-white italic tracking-tight leading-none"
              style={{ fontFamily: "'Noto Serif', serif" }}>
            Tu diseño, <br /> tu identidad
          </h1>
          <div className="mt-12 w-24 h-px bg-yellow-300 mx-auto" />
        </div>

        {/* Marca en esquina superior izquierda */}
        <div className="absolute top-12 left-12 z-20">
          <span className="text-xl tracking-tighter text-white"
                style={{ fontFamily: "'Noto Serif', serif" }}>
            T-PRINTS
          </span>
        </div>
      </section>

      {/* ── Panel derecho: formulario ───────────────────────────────────── */}
      {/*
       * WAI-ARIA: aria-label identifica la sección para lectores de pantalla
       * (WCAG 1.3.1 – Info and Relationships).
       */}
      <section
        aria-label="Inicio de sesión"
        className="flex flex-col w-full md:w-1/2 lg:w-2/5 bg-white
                   px-8 md:px-16 lg:px-24 py-12 justify-center min-h-screen"
      >
        {/* Logo visible solo en móvil */}
        <div className="md:hidden mb-16">
          <span className="text-2xl tracking-tighter text-gray-900"
                style={{ fontFamily: "'Noto Serif', serif" }}>
            T-PRINTS
          </span>
        </div>

        <div className="max-w-md w-full mx-auto">

          {/* ── Encabezado ──────────────────────────────────────────────── */}
          {/*
           * W3C / WCAG 1.3.1: <header> dentro de la sección agrupa
           * semánticamente el título del formulario.
           * Se usa <h2> porque el <h1> ya existe en el panel izquierdo;
           * en móvil, si el panel no se muestra, el contexto de marca
           * está en el logo arriba.
           */}
          <header className="mb-12">
            {/* Botón volver — aria-label descriptivo (WCAG 2.4.6) */}
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-gray-900 rounded transition-colors mb-8 text-sm"
              aria-label="Volver a la página anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
              </svg>
              Volver
            </button>

            <h2 className="text-4xl text-gray-900 mb-3"
                style={{ fontFamily: "'Noto Serif', serif" }}>
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-500 text-sm tracking-wide">
              Ingresa tus datos para acceder a tu cuenta.
            </p>
          </header>

          {/* ── Formulario ──────────────────────────────────────────────── */}
          {/*
           * W3C: id="login-form" destino del enlace de salto.
           * noValidate permite control personalizado de validación accesible.
           */}
          <form
            id="login-form"
            onSubmit={handleLogin}
            noValidate
            className="space-y-8"
          >
            {/* Región de error en vivo
                WAI-ARIA: role="alert" + aria-live="assertive" anuncia errores
                inmediatamente a tecnologías asistivas (WCAG 4.1.3).
                El div siempre existe en el DOM para que el AT lo observe. */}
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              id="login-error"
              className={error ? "" : "sr-only"}
            >
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50
                              px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </div>

            {/* ── Campo identificador ─────────────────────────────────── */}
            {/*
             * WCAG 1.3.5: autocomplete="username" ayuda a gestores de
             * contraseñas y usuarios con discapacidades cognitivas.
             * htmlFor → id asocia explícitamente label e input (WCAG 1.3.1).
             */}
            <div className="space-y-2">
              <label
                htmlFor="identificador"
                className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 ml-1"
              >
                Correo o nombre de usuario
              </label>
              <input
                id="identificador"
                name="identificador"
                type="text"
                autoComplete="username"
                required
                aria-required="true"
                aria-describedby={error ? "login-error" : undefined}
                placeholder="correo@ejemplo.com o tu usuario"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="w-full bg-gray-50 border-b border-gray-200
                           focus:border-yellow-500 focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-yellow-400
                           transition-all duration-300 py-4 px-4 text-sm
                           text-gray-900 placeholder:text-gray-400 rounded-sm"
              />
            </div>

            {/* ── Campo contraseña ────────────────────────────────────── */}
            {/*
             * WCAG 1.3.5: autocomplete="current-password".
             * El botón de mostrar/ocultar tiene aria-label dinámico y
             * aria-controls apuntando al input (WAI-ARIA 1.2).
             * aria-pressed indica estado binario (WCAG 4.1.2).
             */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label
                  htmlFor="password"
                  className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 ml-1"
                >
                  Contraseña
                </label>
                {/* Enlace "¿Olvidaste?" — decorativo en el diseño actual */}
                <span
                  className="text-[10px] tracking-widest uppercase text-yellow-700
                             cursor-default select-none"
                  aria-hidden="true"
                >
                  ¿Olvidaste?
                </span>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-b border-gray-200
                             focus:border-yellow-500 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-yellow-400
                             transition-all duration-300 py-4 pl-4 pr-12 text-sm
                             text-gray-900 placeholder:text-gray-400 rounded-sm"
                />

                {/* Botón mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-900 transition-colors
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-gray-900
                             rounded"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5
                           12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45
                           0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523
                           0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894
                           7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242
                           4.242L9.88 9.88"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12
                           4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577
                           16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ── Acciones ─────────────────────────────────────────────── */}
            <div className="pt-4 space-y-6">

              {/* Botón principal de envío
                  WCAG 4.1.2: aria-busy comunica estado de carga.
                  disabled evita doble envío. */}
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full py-5 bg-gray-900 text-white text-xs
                           tracking-[0.3em] uppercase rounded-md
                           hover:bg-gray-700 disabled:bg-gray-300
                           disabled:cursor-not-allowed disabled:text-gray-500
                           transition-all duration-500 active:scale-[0.98]
                           shadow-sm focus-visible:outline
                           focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-gray-900
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"
                         fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Ingresando…
                  </>
                ) : (
                  "Ingresar"
                )}
              </button>

              {/* Separador
                  WAI-ARIA: role="separator" con aria-hidden para que no se
                  anuncie como contenido significativo (WCAG 1.3.1). */}
              <div className="relative flex items-center py-4" role="separator" aria-hidden="true">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink mx-4 text-[9px] tracking-[0.2em]
                                 uppercase text-gray-400">
                  O continúa con
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* Botón Google
                  WAI-ARIA: aria-label descriptivo porque el botón contiene
                  solo un SVG + texto (WCAG 2.4.6).
                  El SVG tiene aria-hidden; el texto visible es suficiente. */}
              <button
                type="button"
                aria-label="Iniciar sesión con Google"
                className="w-full py-4 bg-white border border-gray-200
                           flex items-center justify-center gap-3
                           text-xs tracking-widest uppercase text-gray-800
                           hover:bg-gray-50 transition-all duration-300 rounded-sm
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          </form>

          {/* ── Pie de página ────────────────────────────────────────────── */}
          {/*
           * W3C: <footer> dentro de <section> es correcto en HTML5.
           * Link de registro con texto descriptivo (WCAG 2.4.4 – Link Purpose).
           */}
          <footer className="mt-20 text-center">
            <p className="text-[10px] tracking-widest uppercase text-gray-400">
              ¿Nuevo en T-Prints?{" "}
              <Link
                to="/registro"
                className="text-yellow-700 hover:text-gray-900 underline
                           underline-offset-4 ml-1 transition-all duration-300
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900
                           rounded"
              >
                Crear cuenta
              </Link>
            </p>
          </footer>

        </div>
      </section>
    </main>
  );
}
