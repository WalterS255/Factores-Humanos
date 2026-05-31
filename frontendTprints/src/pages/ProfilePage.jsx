import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { clearSession, getCurrentUser, isAuthenticated } from "../services/api.js";
import { getMyOrders } from "../services/orderService.js";

import iconProfile  from "../assets/icons/profile.png";
import iconUsername from "../assets/icons/username.png";
import iconMail     from "../assets/icons/mail.png";
import iconBadge    from "../assets/icons/bagde.png";
import iconEdit     from "../assets/icons/editar.png";
import iconSalir    from "../assets/icons/salir.png";



const defaultPhoto =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80";

function getImageUrl(url) {
  if (!url) return defaultPhoto;
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveFileMatch?.[1])
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w1000`;
  const driveIdMatch = url.match(/[?&]id=([^&]+)/);
  if (url.includes("drive.google.com") && driveIdMatch?.[1])
    return `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w1000`;
  return url;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(dateValue) {
  if (!dateValue) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75
         1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0
         0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375
         0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375
         0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
  </svg>
);
const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45
         1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125
         0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
  </svg>
);

/* ── Componente principal ── */
export default function ProfilePage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const [orders,        setOrders]        = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError,   setOrdersError]   = useState("");

  const [editOpen,       setEditOpen]       = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [editForm,       setEditForm]       = useState({
    nombres:       "",
    apellidos:     "",
    nombreUsuario: "",
    correo:        "",
    telefono:      "",
    fotoPerfilUrl: "",
  });

  const user = currentUser;

  const fullName = user
    ? `${user.nombres || ""} ${user.apellidos || ""}`.trim()
    : "Usuario invitado";

  const profilePhoto = getImageUrl(user?.fotoPerfilUrl);

  const profileInfo = [
    { label: "Nombres",  value: fullName || "Sin nombre",             icon: iconProfile  },
    { label: "Usuario",  value: user?.nombreUsuario || "Sin usuario", icon: iconUsername },
    { label: "Correo",   value: user?.correo || "Sin correo",         icon: iconMail     },
    { label: "Roles",    value: user?.roles?.join(", ") || "Sin rol", icon: iconBadge    },
  ];

  const openEditProfile = () => {
    if (!user) return;
    setProfileMessage("");
    setEditForm({
      nombres:       user.nombres       || "",
      apellidos:     user.apellidos     || "",
      nombreUsuario: user.nombreUsuario || "",
      correo:        user.correo        || "",
      telefono:      user.telefono      || "",
      fotoPerfilUrl: user.fotoPerfilUrl || "",
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({ ...prev, ...editForm }));
    setEditOpen(false);
    setProfileMessage("Perfil actualizado correctamente.");
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated()) {
        setLoadingOrders(false);
        setOrdersError("Debes iniciar sesión para ver tus pedidos.");
        return;
      }
      try {
        setLoadingOrders(true);
        setOrdersError("");
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        setOrdersError(err.message || "No se pudieron cargar los pedidos.");
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-[#fbf9f4] text-[#1b1c19]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ── Enlace de salto (WCAG 2.4.1) ───────────────────────────────── */}
      <a
        href="#perfil-contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                   focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-sm
                   focus:font-bold focus:text-gray-900 focus:rounded focus:outline focus:outline-2"
      >
        Saltar al contenido del perfil
      </a>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <main
        id="perfil-contenido"
        className="flex-1 pt-8 pb-28 px-6 md:px-12 max-w-screen-2xl mx-auto w-full"
      >
        {/* ── Encabezado editorial ─────────────────────────────────────── */}
        <header className="mb-14">
          <h1
            className="text-4xl md:text-6xl tracking-tight leading-tight text-gray-900"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Mi perfil
          </h1>
          <p className="mt-3 text-gray-500 text-sm leading-relaxed">
            Gestiona tu información personal y consulta el historial de tus pedidos.
          </p>
        </header>

        {/* ── Layout dos columnas ──────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] items-start">

          {/* ══ COLUMNA IZQUIERDA: tarjeta de perfil ══════════════════════
              WAI-ARIA: <aside> con aria-label (WCAG 1.3.1).
          ══════════════════════════════════════════════════════════════ */}
          <aside
            aria-label="Información del perfil"
            className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-8"
          >

            {/* Foto + nombre + rol */}
            <div className="flex flex-col items-center text-center pb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 bg-gray-100">
                <img
                  src={profilePhoto}
                  alt={`Foto de perfil de ${fullName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = defaultPhoto; }}
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900 leading-tight">
                {fullName}
              </h2>

              <span className="mt-1 text-sm font-semibold tracking-widest uppercase text-blue-500">
                {user?.roles?.join(" · ") || "Invitado"}
              </span>
            </div>

            {/* Datos del perfil */}
            <dl className="space-y-3">
              {profileInfo.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                >
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center
                               bg-white rounded-xl shadow-sm"
                    aria-hidden="true"
                  >
                    <img src={icon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold">
                      {label}
                    </dt>
                    <dd className="text-sm text-gray-900 font-medium truncate">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Acciones */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={openEditProfile}
                disabled={!user}
                className="inline-flex items-center justify-center gap-2 bg-blue-500
                           text-white text-sm font-semibold py-3 px-5 rounded-xl
                           hover:bg-blue-600 transition-colors duration-200
                           disabled:bg-gray-300 disabled:cursor-not-allowed
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <img src={iconEdit} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                Editar perfil
              </button>

              {profileMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {profileMessage}
                </div>
              )}

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión de tu cuenta"
                  className="inline-flex items-center justify-center gap-2 border
                             border-red-200 text-red-500 text-sm font-semibold
                             py-3 px-5 rounded-xl hover:bg-red-50 transition-colors
                             duration-200 focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  <img src={iconSalir} alt="" className="w-5 h-5 object-contain" />
                  Cerrar sesión
                </button>
              )}
            </div>
          </aside>

          {/* ══ COLUMNA DERECHA: historial de pedidos ════════════════════ */}
          <section aria-label="Historial de pedidos">

            {/* Sub-encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between
                            gap-5 mb-10 pb-8 border-b border-gray-100">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#775a19] mb-2">
                  Historial
                </p>
                <h2
                  className="text-3xl text-gray-900"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Mis pedidos
                </h2>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  Consulta el estado y detalle de cada compra realizada.
                </p>
              </div>

              <Link
                to="/productos"
                className="shrink-0 inline-flex items-center gap-2 text-[11px]
                           tracking-widest uppercase text-gray-900 border-b
                           border-gray-300 pb-0.5 hover:border-gray-900
                           transition-all duration-300
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-gray-900 rounded"
              >
                <IconCart />
                Comprar más
              </Link>
            </div>

            {/* Aviso sin sesión */}
            {!user && (
              <div role="note"
                   className="border border-yellow-200 bg-yellow-50 px-5 py-4
                              text-sm text-yellow-700 mb-6">
                No has iniciado sesión. Para ver tus pedidos,{" "}
                <Link to="/login" className="font-bold underline underline-offset-2">
                  entra con tu cuenta
                </Link>
                .
              </div>
            )}

            {/* Estado: cargando */}
            {loadingOrders && (
              <div role="status" aria-live="polite"
                   className="flex items-center gap-3 py-12 text-gray-400 text-sm">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"
                     fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Cargando pedidos…
              </div>
            )}

            {/* Estado: error */}
            {ordersError && !loadingOrders && (
              <div role="alert" aria-live="assertive"
                   className="border border-red-200 bg-red-50 px-5 py-4
                              text-sm font-medium text-red-700 mb-6">
                {ordersError}
              </div>
            )}

            {/* Estado: sin pedidos */}
            {!loadingOrders && !ordersError && orders.length === 0 && (
              <div className="flex min-h-[320px] flex-col items-center justify-center
                              border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100
                                rounded-full mb-5 text-gray-300">
                  <IconReceipt />
                </div>
                <h3
                  className="text-2xl text-gray-900 mb-3"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Todavía no tienes pedidos
                </h3>
                <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
                  Cuando finalices una compra, el detalle aparecerá en esta sección.
                </p>
                <Link
                  to="/productos"
                  className="bg-gray-900 text-white px-8 py-3 text-xs tracking-widest
                             uppercase hover:bg-gray-700 transition-all duration-300
                             rounded-sm focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Ver productos
                </Link>
              </div>
            )}

            {/* Lista de pedidos
                W3C: <ul>/<li> para lista de pedidos (WCAG 1.3.1). */}
            {!loadingOrders && !ordersError && orders.length > 0 && (
              <ul className="space-y-0 divide-y divide-gray-100 list-none p-0 m-0"
                  aria-label="Lista de pedidos">
                {orders.map((order) => (
                  <li key={order.idPedido} className="py-10">
                    <article aria-label={`Pedido número ${order.idPedido}`}>

                      {/* Cabecera del pedido */}
                      <div className="flex flex-col sm:flex-row sm:items-start
                                      justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="text-[#775a19]">
                            <IconReceipt />
                          </div>
                          <div>
                            <h3
                              className="text-xl text-gray-900"
                              style={{ fontFamily: "'Noto Serif', serif" }}
                            >
                              Pedido #{order.idPedido}
                            </h3>
                            <p className="text-[11px] tracking-wide text-gray-400 mt-0.5">
                              {formatDate(order.fechaCreacion)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2">
                          {/* Badge de estado — no solo color (WCAG 1.4.1) */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1
                                           text-[10px] tracking-widest uppercase
                                           bg-gray-100 text-gray-600 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400
                                             inline-block" aria-hidden="true"/>
                            {order.estadoPedido}
                          </span>
                          <p className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>

                      {/* Desglose económico
                          W3C: <dl> para pares término-valor (WCAG 1.3.1). */}
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px
                                     bg-gray-100 border border-gray-100 mb-6">
                        {[
                          { term: "Subtotal",  value: formatCurrency(order.subtotal)  },
                          { term: "Envío",     value: formatCurrency(order.costoEnvio) },
                          { term: "Dirección", value: `${order.direccionEnvio || ""}, ${order.ciudadEnvio || ""}`.replace(/^,\s*/, "") || "—" },
                        ].map(({ term, value }) => (
                          <div key={term} className="bg-[#fbf9f4] px-4 py-3">
                            <dt className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">
                              {term}
                            </dt>
                            <dd className="text-sm font-medium text-gray-800 truncate">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {/* Ítems del pedido */}
                      {(order.items || []).length > 0 && (
                        <div>
                          <h4 className="text-[10px] tracking-widest uppercase
                                         text-gray-400 mb-4">
                            Productos del pedido
                          </h4>
                          <ul className="space-y-0 divide-y divide-gray-100
                                         border border-gray-100 list-none p-0 m-0"
                              aria-label={`Ítems del pedido ${order.idPedido}`}>
                            {(order.items || []).map((item) => (
                              <li
                                key={item.idPedidoItem}
                                className="flex flex-col sm:flex-row sm:items-center
                                           sm:justify-between gap-3 px-4 py-4"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {item.producto}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                                    {item.color} | Talla {item.talla}
                                  </p>
                                  {item.tituloDiseno && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                      Diseño: {item.tituloDiseno}
                                    </p>
                                  )}
                                  {item.imagenPersonalizadaUrl && (
                                    <a
                                      href={item.imagenPersonalizadaUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label={`Ver imagen personalizada de ${item.producto}`}
                                      className="mt-1 inline-block text-[11px] font-semibold
                                                 text-[#775a19] hover:text-gray-900 underline
                                                 underline-offset-2 transition-colors
                                                 focus-visible:outline focus-visible:outline-2
                                                 focus-visible:outline-gray-900 rounded"
                                    >
                                      Ver imagen personalizada
                                    </a>
                                  )}
                                </div>
                                <div className="text-left sm:text-right shrink-0">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(item.subtotal)}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    Cant. {item.cantidad} · {formatCurrency(item.precioUnitario)} c/u
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* ── Footer editorial (desktop) ───────────────────────────────────── */}
      <footer
        className="hidden md:flex flex-col md:flex-row justify-between items-center
                   px-12 py-10 border-t border-gray-100 bg-[#f5f3ee] gap-6"
        aria-label="Pie de página"
      >
        <span className="text-lg tracking-tighter text-gray-900"
              style={{ fontFamily: "'Noto Serif', serif" }}>
          T-PRINTS
        </span>
        <nav aria-label="Vínculos legales" className="flex gap-8">
          {["Privacidad", "Términos", "Contacto"].map((l) => (
            <span key={l} className="text-[10px] tracking-widest uppercase text-gray-400">{l}</span>
          ))}
        </nav>
        <p className="text-[10px] tracking-widest uppercase text-gray-400 opacity-60">
          © 2026 T-PRINTS. Todos los derechos reservados.
        </p>
      </footer>

      <BottomNav />

      {/* ── Modal Editar perfil ──────────────────────────────────────────── */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <p className="text-xs font-bold tracking-widest uppercase text-blue-500 mb-1">Perfil</p>
            <h2 className="text-2xl font-bold text-gray-900">Editar perfil</h2>
            <p className="text-sm text-gray-400 mt-1 mb-5">Actualiza la información visible de tu cuenta.</p>

            <button
              type="button"
              onClick={() => setEditOpen(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>

            {/* Vista previa foto */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100 shrink-0 bg-gray-200">
                <img
                  src={getImageUrl(editForm.fotoPerfilUrl) || defaultPhoto}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = defaultPhoto; }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Vista previa</p>
                <p className="text-xs text-gray-400">Puedes pegar una URL normal o una URL de Google Drive.</p>
              </div>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-nombres">Nombres</label>
                  <input
                    id="edit-nombres" name="nombres" type="text"
                    value={editForm.nombres} onChange={handleEditChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-apellidos">Apellidos</label>
                  <input
                    id="edit-apellidos" name="apellidos" type="text"
                    value={editForm.apellidos} onChange={handleEditChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-usuario">Nombre de usuario</label>
                <input
                  id="edit-usuario" name="nombreUsuario" type="text"
                  value={editForm.nombreUsuario} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-correo">Correo</label>
                <input
                  id="edit-correo" name="correo" type="email"
                  value={editForm.correo} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-telefono">Teléfono</label>
                <input
                  id="edit-telefono" name="telefono" type="tel"
                  placeholder="+57 300 123 4567"
                  value={editForm.telefono} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edit-foto">Foto de perfil URL</label>
                <input
                  id="edit-foto" name="fotoPerfilUrl" type="url"
                  placeholder="https://..."
                  value={editForm.fotoPerfilUrl} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
