import inicioIcon from "../assets/icons/inicio.png";
import shoppingCartIcon from "../assets/icons/shoppingcart.png";
import designIcon from "../assets/icons/design.png"; 
import profileIcon from "../assets/icons/profile.png";
import diseñosIcon from "../assets/icons/diseños.png";

export const navItems = [
  { label: 'Inicio', icon: inicioIcon, to: '/productos', fillWhenActive: false },
  { label: 'Carrito', icon: shoppingCartIcon, to: '/pedidos', fillWhenActive: true },
  { label: 'Diseños', icon: diseñosIcon, to: '/disenos', fillWhenActive: true },
  { label: 'Diseñar', icon: designIcon, to: '/disenar', fillWhenActive: false, end: true },
  { label: 'Perfil', icon: profileIcon, to: '/perfil', fillWhenActive: false },
];