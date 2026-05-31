# T-Prints (React)

Este proyecto es la migración **desde cero** de los HTML del zip `Interfaces-main` a una app React con **Vite + Tailwind + React Router**.

## Rutas incluidas

- `/productos` → Pantalla **Productos (Camisas)** (migrada desde `Main.html`)
- `/disenos` → Pantalla **Estampas / Dashboard** (migrada desde `Dashboard html.html`)
- `/login` → Pantalla **Login** (migrada desde `login.html`)
- `/registro` → Pantalla **Create Account** (migrada desde `Create Account html.html`)

Extras (placeholders, porque en el prototipo no venían HTML):
- `/inicio`, `/disenar`, `/pedidos`, `/perfil`

## Cómo ejecutar

1) Instala dependencias:

```bash
npm install
```

2) Levanta en dev:

```bash
npm run dev
```

3) Build:

```bash
npm run build
npm run preview
```

## Tailwind / tema

- Tailwind está configurado con `darkMode: 'class'`.
- La app aplica modo oscuro automáticamente según sistema (o `localStorage.theme`).

Para forzar modo oscuro manualmente:

```js
localStorage.setItem('theme', 'dark')
location.reload()
```

Para volver a automático:

```js
localStorage.removeItem('theme')
location.reload()
```

## Assets

En `public/assets/` quedaron los PNG de referencia que venían en el zip original.
