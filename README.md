# LinkNest

Organiza y redescubre tus enlaces favoritos en un mismo lugar. Guarda artículos, vídeos, recursos y mucho más con una interfaz moderna y animada.

## ✨ Características principales

### Guarda y organiza tus enlaces
- 🔑 **Autenticación** con correo/contraseña o Google mediante Supabase para proteger tu espacio personal.【F:frontend/src/pages/Auth/LoginPage.tsx†L1-L129】
- ➕ **Crea enlaces** con título opcional, descripción, categoría, etiquetas y favoritos desde un formulario pensado para la productividad.【F:frontend/src/pages/Links/CreateLinkPage.tsx†L1-L220】
- 📝 **Edita o elimina enlaces** y marca favoritos directamente desde la lista, con filtros por texto, categoría o favoritos.【F:frontend/src/pages/Links/ListLinkPage.tsx†L1-L166】
- 📤 **Importa marcadores** en formato HTML para migrar rápidamente tu biblioteca actual.【F:frontend/src/components/links/ImportBookmarksDialog.tsx†L1-L134】

### Gestiona tus categorías
- 🌳 **Árbol de categorías jerárquico** con creación, edición y eliminación, más búsqueda instantánea.【F:frontend/src/pages/Categories/ListCategoryPage.tsx†L1-L140】
- 🔀 **Reordenamiento por arrastrar y soltar** para reorganizar categorías en el mismo nivel.【F:frontend/src/components/categories/CategoryTree.tsx†L1-L136】
- 🤝 **Comparte categorías** con otras personas por correo electrónico y gestiona sus permisos desde un mismo diálogo.【F:frontend/src/components/categories/ShareCategoryDialog.tsx†L1-L101】

### Analiza tu actividad
- 📈 **Panel de uso** con totales, enlaces más visitados y enlaces nunca abiertos, filtrables por rango de fechas personalizado.【F:frontend/src/pages/UsagePage.tsx†L1-L178】
- 🔎 **Seguimiento de aperturas** automático cada vez que visitas un enlace para alimentar las métricas.【F:frontend/src/components/links/LinkCard.tsx†L1-L47】

### Experiencia web moderna
- 🌍 **Interfaz multilingüe** en español e inglés con detección automática y carga dinámica de traducciones.【F:frontend/src/i18n/index.ts†L1-L32】
- 📱 **Diseño responsive** con Tailwind CSS, DaisyUI y animaciones de Framer Motion en toda la aplicación.【F:frontend/src/pages/HomePage.tsx†L1-L192】
- 📦 **Aplicación instalable (PWA)** con manifest personalizable, modo offline y pantalla dedicada cuando no hay conexión.【F:frontend/vite.config.ts†L1-L49】【F:frontend/src/pages/OfflinePage.tsx†L1-L45】
- 🔐 **Gestión de perfil** para actualizar tu contraseña y cerrar sesiones en otros dispositivos de forma segura.【F:frontend/src/pages/ProfilePage.tsx†L1-L218】
- 🧩 **Extensión oficial** para Chrome disponible en la [Chrome Web Store](https://chromewebstore.google.com/detail/linknest-%E2%80%93-save-to-linkne/inhbpecnljglajkelbkgipjnokmmnkgc).

## 🛠️ Tecnologías

- [React](https://react.dev/) + [React Router](https://reactrouter.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Dnd Kit](https://dndkit.com/)
- [Lucide Icons](https://lucide.dev/)
- [Playwright](https://playwright.dev/) y [Vitest](https://vitest.dev/) para pruebas automatizadas

## 🚀 Comenzar

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tomasrl18/LinkNest.git
   cd LinkNest/frontend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=your_url_from_supabase
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   Estas variables se usan para inicializar el cliente de Supabase en la aplicación.【F:frontend/src/lib/supabase.ts†L1-L4】
4. Inicia el proyecto en modo desarrollo:
   ```sh
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📋 Scripts útiles

- `npm run dev` — servidor de desarrollo
- `npm run build` — compila para producción
- `npm run preview` — vista previa de producción
- `npm run lint` — linting de código
- `npm run test` — pruebas unitarias con Vitest
- `npm run test:e2e` — pruebas end-to-end con Playwright
  
  Basado en los scripts definidos en `package.json`.【F:frontend/package.json†L7-L23】

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes una propuesta de mejora, no dudes en abrir un *issue* o enviar un *pull request*.

## 📬 Contacto y sugerencias

Para dudas, comentarios o sugerencias sobre LinkNest, puedes escribirnos a [`mailslinknest@gmail.com`](mailto:mailslinknest@gmail.com).

También puedes unirte a nuestro [canal de Telegram](https://t.me/+g1KnAhMu7xFjMjdk) para compartir tu opinión y estar al tanto de las novedades.

## Licencia

Proyecto disponible bajo licencia [MIT](LICENSE).

---

Hecho con ❤️ y ☕ por [@tomasrl18](https://github.com/tomasrl18)
