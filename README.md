# LinkNest

LinkNest is a web application to organize, categorize and rediscover your favorite links in one place. Save articles, videos, resources and more, with a modern and fast interface built with React, TypeScript, Vite and Supabase.

## Features

- **User authentication** (Supabase Auth)
- **Add links** with title, description, category, tags and favorites
- **Filter and search** by text, category or bookmarks
- **Modern interface** with Tailwind CSS, DaisyUI and animations with Framer Motion
- **Link management**: create, edit and delete your links
- **Responsive**: works on desktop and mobile devices

## Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/) (Database & auth)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide Icons](https://lucide.dev/)

## Installation Guide

1. Clone repo:

   ```sh
   git clone https://github.com/tomasrl18/LinkNest.git
   cd LinkNest/frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set the environment variables in `.env.local`:

   ```
   VITE_SUPABASE_URL=your_url_from_supabase
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Launch the app:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Useful scripts

- `npm run dev` — Starts the development server
- `npm run build` — Compile the app for production
- `npm run preview` — Preview production app
- `npm run lint` — Linting of code

## License

This project is licensed under the [MIT License](LICENSE).

---

Done with ❤️ & ☕️ by [@tomasrl18](https://github.com/tomasrl18)