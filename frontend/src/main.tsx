import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthProvider.tsx';
import './index.css'
import App from './App.tsx'
import './i18n';
import "flag-icons/css/flag-icons.min.css";
import { registerSW } from 'virtual:pwa-register';

const updateServiceWorkerRegistration = typeof window !== 'undefined'
    ? registerSW({
        onNeedRefresh() {
            document.dispatchEvent(new CustomEvent('pwa:need-refresh'));
        },
        onOfflineReady() {
            document.dispatchEvent(new CustomEvent('pwa:offline-ready'));
        },
    })
    : undefined;

export function usePwaUpdate() {
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [offlineReady, setOfflineReady] = useState(false);

    useEffect(() => {
        const handleNeedRefresh = () => setNeedsRefresh(true);
        const handleOfflineReady = () => setOfflineReady(true);

        document.addEventListener('pwa:need-refresh', handleNeedRefresh);
        document.addEventListener('pwa:offline-ready', handleOfflineReady);

        return () => {
            document.removeEventListener('pwa:need-refresh', handleNeedRefresh);
            document.removeEventListener('pwa:offline-ready', handleOfflineReady);
        };
    }, []);

    const update = useCallback(async () => {
        setNeedsRefresh(false);
        if (updateServiceWorkerRegistration) {
            await updateServiceWorkerRegistration();
        }
    }, []);

    return {
        needsRefresh,
        offlineReady,
        updateServiceWorker: update,
    };
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
