declare module 'virtual:pwa-register' {
    interface RegisterSWOptions {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: unknown) => void;
    }

    export function registerSW(options?: RegisterSWOptions): (() => Promise<void>) | undefined;
}

declare module 'vite-plugin-pwa' {
    import type { Plugin } from 'vite';

    interface VitePWAOptions {
        registerType?: 'prompt' | 'autoUpdate';
        includeAssets?: string[];
        manifest?: Record<string, unknown>;
        workbox?: {
            globPatterns?: string[];
        };
    }

    export function VitePWA(options?: VitePWAOptions): Plugin;
}
