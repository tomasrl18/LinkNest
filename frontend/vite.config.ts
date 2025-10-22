import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'icons/favicon.ico',
                'icons/icon-16x16.png',
                'icons/icon-32x32.png',
                'icons/icon-192x192.png',
                'icons/icon-512x512.png',
                'icons/apple-touch-icon.png',
                'offline.html',
            ],
            manifest: {
                name: 'LinkNest',
                short_name: 'LinkNest',
                description: 'Organiza y redescubre tus enlaces favoritos en un mismo lugar.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                theme_color: '#0ea5e9',
                background_color: '#0f172a',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-32x32.png',
                        sizes: '32x32',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-16x16.png',
                        sizes: '16x16',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/apple-touch-icon.png',
                        sizes: '180x180',
                        type: 'image/png',
                        purpose: 'any',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,woff2}'],
            },
        }),
    ],
})
