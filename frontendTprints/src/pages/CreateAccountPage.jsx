import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService.js";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [nombres,       setNombres]       = useState("");
  const [apellidos,     setApellidos]     = useState("");
  const [correo,        setCorreo]        = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [telefono,      setTelefono]      = useState("");
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [rol,           setRol]           = useState("CLIENTE");
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({
        nombres,
        apellidos,
        correo,
        nombreUsuario,
        password,
        telefono,
        fotoPerfilUrl: "",
        rol,
      });

      navigate("/productos");
    } catch (err) {
      setError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  /* Clases reutilizables para inputs */
  const inputClass =
    "w-full bg-gray-50 border-b border-gray-200 focus:border-yellow-500 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 " +
    "transition-all duration-300 py-3 px-0 text-sm text-gray-900 " +
    "placeholder:text-gray-400 tracking-wide rounded-none";

  const labelClass =
    "block text-[10px] tracking-widest uppercase text-gray-500 mb-2 " +
    "group-focus-within:text-yellow-700 transition-colors";

  return (
    /*
     * W3C: <main> como landmark principal (WCAG 1.3.1).
     */
    <main
      className="min-h-screen flex flex-col md:flex-row h-screen overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ── Enlace de salto (WCAG 2.4.1 – Bypass Blocks) ──────────────── */}
      <a
        href="#register-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded
                   focus:outline focus:outline-2"
      >
        Saltar al formulario de registro
      </a>

      {/* ── Logo flotante centrado (móvil) / esquina derecha (desktop) ── */}
      {/*
       * aria-label describe el enlace de marca (WCAG 2.4.4).
       * En desktop solo es decorativo/navegación de vuelta al inicio.
       */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-10
                      md:translate-x-0 z-50">
        <span
          className="text-lg md:text-xl tracking-tighter text-gray-900 select-none"
          style={{ fontFamily: "'Noto Serif', serif" }}
          aria-hidden="true"
        >
          T-PRINTS
        </span>
      </div>

      {/* ── Panel izquierdo: visual decorativo ─────────────────────────── */}
      {/*
       * aria-hidden="true": panel puramente decorativo (WCAG 1.1.1).
       */}
      <section
        aria-hidden="true"
        className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden bg-gray-800"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            role="presentation"
            className="w-full h-full object-cover opacity-60 grayscale
                       hover:grayscale-0 transition-all duration-1000"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc_4xZcFrp2OrkVff5KTHaDV2veees7PcZEG9PcM_ImYjl99yjlNcbcWrFpsB24hdNt4CntWsLyzXg0u24RdHvOdTwjxuTQvL5ONitjRgdhzIRXoGrSZKi4H1z0Jb1_i09SfKtN6sPCPgx81mVNy99Dpn5nluMnBv5o2rfplzsThX6ztDnX-guJpMTtEoFp7rVxjDDdYPcAhEL--ij_8dnc-SzjxM0F5QmIxnySZwWFfo9ioyu6lj77rY8G0Pdu4EgXW0ZjMWLyB5Z"
          />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between
                        p-12 lg:p-20 text-white">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
              Establecido 2026
            </p>
          </div>

          <div className="max-w-md">
            <h1
              className="text-5xl lg:text-7xl tracking-tighter leading-tight italic"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              El arte del <br /> diseño propio
            </h1>
            <p className="mt-8 text-gray-400 font-light leading-relaxed max-w-xs text-sm">
              Bienvenido al cruce entre el diseño contemporáneo y la identidad
              personal. Una galería donde cada pieza es una obra maestra.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-12 h-px bg-gray-600" />
            <span className="text-[10px] tracking-widest uppercase text-gray-500">
              T-PRINTS
            </span>
          </div>
        </div>
      </section>

      {/* ── Panel derecho: formulario ───────────────────────────────────── */}
      {/*
       * WAI-ARIA: aria-label identifica la sección (WCAG 1.3.1).
       * overflow-y-auto permite scroll interno sin romper el layout.
       */}
      <section
        aria-label="Crear cuenta"
        className="flex-1 bg-white flex flex-col overflow-y-auto
                   px-6 py-12 md:px-16 lg:px-24 md:py-16 justify-center items-center"
      >
        <div className="w-full max-w-md">

          {/* ── Encabezado ──────────────────────────────────────────────── */}
          <header className="mb-10">
            {/* Botón volver — aria-label descriptivo (WCAG 2.4.6) */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Volver a la página anterior"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900
                         focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-gray-900
                         rounded transition-colors mb-8 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
              </svg>
              Volver
            </button>

            {}
            <h2
              className="text-3xl text-gray-900 mb-3"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Crear cuenta
            </h2>
            <p className="text-gray-500 font-light text-sm leading-relaxed">
              Regístrate para comprar, subir diseños y personalizar camisetas.
            </p>
          </header>

          {/* ── Formulario ──────────────────────────────────────────────── */}
          {/*
           * id="register-form" destino del enlace de salto.
           * noValidate permite control de validación accesible propio.
           */}
          <form
            id="register-form"
            onSubmit={handleRegister}
            noValidate
            className="space-y-7"
          >
            {/* Región de errores en vivo
                WAI-ARIA: role="alert" + aria-live="assertive" (WCAG 4.1.3). */}
            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              id="register-error"
              className={error ? "" : "sr-only"}
            >
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50
                              px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </div>

            {/* ── Nombres y Apellidos (grid 2 columnas) ────────────────── */}
            {/*
             * W3C: <fieldset> + <legend> agrupa campos relacionados
             * semánticamente (WCAG 1.3.1).
             * Mejora visual: grid 2 col en desktop, 1 col en móvil.
             */}
            <fieldset className="border-none p-0 m-0">
              <legend className="sr-only">Nombre completo</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

                {/* Nombres */}
                <div className="group relative">
                  <label htmlFor="nombres" className={labelClass}>
                    Nombres <span aria-hidden="true" className="text-yellow-600">*</span>
                  </label>
                  <input
                    id="nombres"
                    name="nombres"
                    type="text"
                    autoComplete="given-name"
                    required
                    aria-required="true"
                    placeholder="Juan"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Apellidos */}
                <div className="group relative">
                  <label htmlFor="apellidos" className={labelClass}>
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Pérez"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Correo electrónico ──────────────────────────────────── */}
            {/*
             * WCAG 1.3.5: autocomplete="email".
             * htmlFor → id: asociación explícita label↔input (WCAG 1.3.1).
             */}
            <div className="group relative">
              <label htmlFor="correo" className={labelClass}>
                Correo electrónico <span aria-hidden="true" className="text-yellow-600">*</span>
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* ── Nombre de usuario ───────────────────────────────────── */}
            {/* WCAG 1.3.5: autocomplete="username" */}
            <div className="group relative">
              <label htmlFor="nombreUsuario" className={labelClass}>
                Nombre de usuario <span aria-hidden="true" className="text-yellow-600">*</span>
              </label>
              <input
                id="nombreUsuario"
                name="nombreUsuario"
                type="text"
                autoComplete="username"
                required
                aria-required="true"
                placeholder="Ej: juanvanegas"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* ── Teléfono ────────────────────────────────────────────── */}
            {/* WCAG 1.3.5: autocomplete="tel" */}
            <div className="group relative">
              <label htmlFor="telefono" className={labelClass}>
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                placeholder="+57 300 123 4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* ── Contraseña ──────────────────────────────────────────── */}
            {/*
             * Mejora visual: se añade botón mostrar/ocultar igual que en
             * el login (consistencia, WCAG 3.2.4 – Consistent Identification).
             * WCAG 1.3.5: autocomplete="new-password".
             * aria-pressed indica estado binario del toggle (WAI-ARIA 1.2).
             */}
            <div className="group relative">
              <label htmlFor="password" className={labelClass}>
                Contraseña <span aria-hidden="true" className="text-yellow-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400
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

            {/* ── Rol ─────────────────────────────────────────────────── */}
            {/*
             * W3C: <select> con <label> explícito.
             * aria-describedby apunta a la descripción de ayuda (WCAG 1.3.1).
             */}
            <div className="group relative">
              <label htmlFor="rol" className={labelClass}>
                Tipo de cuenta <span aria-hidden="true" className="text-yellow-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="rol"
                  name="rol"
                  required
                  aria-required="true"
                  aria-describedby="rol-hint"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full bg-gray-50 border-b border-gray-200
                             focus:border-yellow-500 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-yellow-400
                             transition-all duration-300 py-3 px-0 text-sm
                             text-gray-900 tracking-wide rounded-none cursor-pointer"
                >
                  <option value="CLIENTE">Cliente — comprar productos</option>
                  <option value="DISENADOR">Diseñador — subir y vender diseños</option>
                </select>
              </div>
              {/* Texto de ayuda contextual (WCAG 1.3.1) */}
              <p id="rol-hint" className="mt-1 text-[10px] text-gray-400 tracking-wide">
                No puedes cambiar el tipo de cuenta después del registro.
              </p>
            </div>

            {/* ── Nota de campos obligatorios ─────────────────────────── */}
            {/* WCAG 3.3.2: se indica qué campos son requeridos */}
            <p className="text-[10px] text-gray-400 tracking-wide -mt-2">
              <span aria-hidden="true" className="text-yellow-600">*</span>{" "}
              Campos obligatorios
            </p>

            {/* ── Botón de envío ──────────────────────────────────────── */}
            {/*
             * aria-busy comunica carga a AT (WCAG 4.1.2).
             * disabled evita doble envío.
             * focus-visible asegura indicador de foco (WCAG 2.4.7).
             */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full bg-gray-900 text-white py-5 font-bold text-xs
                           tracking-[0.2em] uppercase hover:bg-gray-700
                           disabled:bg-gray-300 disabled:cursor-not-allowed
                           disabled:text-gray-500 transition-all active:scale-[0.99]
                           duration-300 rounded-sm shadow-sm
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900
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
                    Creando cuenta…
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </div>
          </form>

          {/* ── Pie de sección ──────────────────────────────────────────── */}
          {/*
           * W3C: <footer> dentro de <section> es correcto en HTML5.
           * Link con texto descriptivo (WCAG 2.4.4 – Link Purpose).
           */}
          <footer className="mt-10">
            <p className="text-[11px] tracking-wider text-gray-400 uppercase">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="ml-1 text-gray-900 font-bold underline underline-offset-4
                           hover:text-yellow-700 transition-colors duration-300
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900
                           rounded"
              >
                Inicia sesión
              </Link>
            </p>

            {/* Separador decorativo con links legales */}
            <div
              className="mt-10 flex gap-8 opacity-40"
              aria-label="Vínculos legales"
            >
              <span className="text-[9px] tracking-widest uppercase text-gray-500">
                Privacidad
              </span>
              <span className="text-[9px] tracking-widest uppercase text-gray-500">
                Términos
              </span>
            </div>
          </footer>

        </div>
      </section>
    </main>
  );
}
