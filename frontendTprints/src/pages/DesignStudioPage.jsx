import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { createDesign } from "../services/designService.js";
import { isAuthenticated } from "../services/api.js";

const TIPOS_DISENO = [
  { value: "PERSONAL",     label: "Personal — uso propio" },
  { value: "DEPORTIVO",    label: "Deportivo" },
  { value: "ARTISTICO",    label: "Artístico" },
  { value: "CORPORATIVO",  label: "Corporativo" },
  { value: "OTRO",         label: "Otro" },
];

export default function DesignStudioPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo:      "",
    descripcion: "",
    imagenUrl:   "",
    tipo:        "PERSONAL",
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!form.titulo.trim() || !form.imagenUrl.trim()) {
      setError("El título y la URL de la imagen son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      await createDesign({
        titulo:      form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        imagenUrl:   form.imagenUrl.trim(),
        tipo:        form.tipo,
      });
      setSuccess("¡Diseño enviado para revisión! Nuestro equipo lo evaluará pronto.");
      setForm({ titulo: "", descripcion: "", imagenUrl: "", tipo: "PERSONAL" });
    } catch (err) {
      setError(err.message || "No se pudo enviar el diseño.");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = form.imagenUrl.trim();

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <a
        href="#studio-contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded focus:outline focus:outline-2"
      >
        Saltar al contenido principal
      </a>

      <main
        id="studio-contenido"
        className="flex-1 pt-8 pb-28 px-6 md:px-12 max-w-screen-2xl mx-auto w-full"
      >
        {/* ── Banner próximamente ──────────────────────────────────────── */}
        <div className="mb-10 flex items-center gap-4 border border-[#775a19]/30
                        bg-[#775a19]/5 px-6 py-4 rounded-sm">
          <div className="shrink-0 w-2 h-2 rounded-full bg-[#775a19] animate-pulse" aria-hidden="true" />
          <p className="text-sm text-[#775a19] font-medium">
            Estamos preparando algo especial —
            <span className="font-bold"> la herramienta de diseño estará disponible muy pronto.</span>
          </p>
        </div>

        {/* ── Encabezado editorial ─────────────────────────────────────── */}
        <header className="mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#775a19] mb-4">
            Estudio creativo
          </p>
          <h1
            className="text-4xl md:text-6xl tracking-tight leading-tight text-gray-900 mb-5"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Diseña tu estampa
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl italic
                        border-l border-gray-200 pl-5 py-1">
            Sube tu diseño y hazlo parte del catálogo T-Prints. Cada pieza aprobada
            estará disponible para estampar en cualquier prenda de nuestra colección.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px] items-start">

          {/* ── Columna izquierda: formulario ────────────────────────── */}
          <section aria-label="Formulario de diseño">

            {success && (
              <div className="mb-8 border border-green-200 bg-green-50 px-5 py-4
                              text-sm font-medium text-green-700 rounded-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-8 border border-red-200 bg-red-50 px-5 py-4
                              text-sm font-medium text-red-600 rounded-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-8">

              {/* Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-[10px] tracking-[0.2em] uppercase font-bold
                             text-gray-500 mb-2"
                >
                  Título del diseño <span className="text-red-400">*</span>
                </label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  maxLength={80}
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Escudo América vintage"
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm
                             text-gray-900 placeholder:text-gray-300
                             focus:border-gray-900 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-gray-900/10
                             transition-all duration-300 rounded-sm"
                />
                <p className="mt-1 text-right text-[10px] text-gray-400">
                  {form.titulo.length}/80
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-[10px] tracking-[0.2em] uppercase font-bold
                             text-gray-500 mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  maxLength={300}
                  rows={5}
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el concepto, colores o estilo de tu diseño..."
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm
                             text-gray-900 placeholder:text-gray-300 resize-none
                             focus:border-gray-900 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-gray-900/10
                             transition-all duration-300 rounded-sm"
                />
                <p className="mt-1 text-right text-[10px] text-gray-400">
                  {form.descripcion.length}/300
                </p>
              </div>

              {/* URL imagen */}
              <div>
                <label
                  htmlFor="imagenUrl"
                  className="block text-[10px] tracking-[0.2em] uppercase font-bold
                             text-gray-500 mb-2"
                >
                  URL de la imagen <span className="text-red-400">*</span>
                </label>
                <input
                  id="imagenUrl"
                  name="imagenUrl"
                  type="url"
                  value={form.imagenUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/mi-diseno.png"
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm
                             text-gray-900 placeholder:text-gray-300
                             focus:border-gray-900 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-gray-900/10
                             transition-all duration-300 rounded-sm"
                />
                <p className="mt-1.5 text-[10px] text-gray-400">
                  Formatos admitidos: PNG, JPG, SVG. Resolución mínima recomendada: 1000 × 1000 px.
                </p>
              </div>

              {/* Tipo de diseño */}
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-[10px] tracking-[0.2em] uppercase font-bold
                             text-gray-500 mb-2"
                >
                  Tipo de diseño <span className="text-red-400">*</span>
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm
                             text-gray-900 focus:border-gray-900 focus:outline-none
                             focus-visible:ring-2 focus-visible:ring-gray-900/10
                             transition-all duration-300 rounded-sm"
                >
                  {TIPOS_DISENO.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <p className="text-[10px] text-gray-400">* Campos obligatorios</p>

              <button
                type="submit"
                disabled={loading || !form.titulo.trim() || !form.imagenUrl.trim()}
                className="w-full bg-gray-900 text-white text-[11px] tracking-widest
                           uppercase py-4 px-6 rounded-sm hover:bg-gray-700
                           transition-all duration-300 inline-flex items-center
                           justify-center gap-3 disabled:bg-gray-300
                           disabled:cursor-not-allowed focus-visible:outline
                           focus-visible:outline-2 focus-visible:outline-offset-2
                           focus-visible:outline-gray-900"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0
                       0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                </svg>
                {loading ? "Enviando…" : "Enviar diseño para revisión"}
              </button>
            </form>

            <Link
              to="/disenos"
              className="mt-10 inline-flex items-center gap-2 text-[10px] tracking-widest
                         uppercase text-gray-500 hover:text-gray-900 transition-colors
                         duration-300 border-b border-gray-200 pb-0.5 hover:border-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Ver catálogo de estampas
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </section>

          {/* ── Columna derecha: vista previa + info ─────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-8">

            {/* Vista previa */}
            <div className="bg-white border border-gray-100 p-5 rounded-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-4">
                Vista previa
              </p>
              <div className="aspect-square bg-gray-50 border border-gray-100 rounded-sm
                              flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa del diseño"
                    className="w-full h-full object-contain p-4"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <div className="text-center px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-3 text-gray-300"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5
                           l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5
                           1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25
                           6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375
                           0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Ingresa la URL de tu imagen para ver la vista previa aquí
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cómo funciona */}
            <div className="bg-white border border-gray-100 p-5 rounded-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-5
                            flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582
                       16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0
                       011.13-1.897l8.932-8.931z"/>
                </svg>
                Cómo funciona
              </p>
              <ol className="space-y-5">
                {[
                  { n: "01", title: "Sube tu diseño",       desc: "Proporciona la URL de la imagen de tu diseño en formato PNG, JPG o SVG de alta resolución." },
                  { n: "02", title: "Revisión editorial",   desc: "Nuestro equipo revisa cada diseño para garantizar calidad y originalidad antes de publicarlo." },
                  { n: "03", title: "Publicación",          desc: "Una vez aprobado, tu diseño queda disponible para estampar en cualquier prenda del catálogo." },
                ].map(({ n, title, desc }) => (
                  <li key={n} className="flex gap-4">
                    <span
                      className="text-[10px] font-bold text-[#775a19] shrink-0 mt-0.5"
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {n}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Consejos de calidad */}
            <div className="bg-white border border-gray-100 p-5 rounded-sm">
              <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-4
                            flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0
                       00.475.345l5.518.442c.499.04.701.663.321.988l-4.204
                       3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0
                       01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982
                       20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0
                       00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563
                       0 00.475-.345L11.48 3.5z"/>
                </svg>
                Consejos de calidad
              </p>
              <ul className="space-y-2.5">
                {[
                  "Usa fondo transparente (PNG) para mejores resultados de estampado.",
                  "Resolución mínima recomendada: 1000 × 1000 px.",
                  "Evita colores muy similares al blanco para que el diseño sea visible.",
                  "Diseños sencillos y con buen contraste se estampan mejor.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
                    <span className="text-[#775a19] shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
