import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

export function OfflinePage() {
    const { t } = useTranslation();

    const handleRetry = () => {
        if (typeof window === 'undefined') return;
        if (window.navigator.onLine) {
            window.location.replace('/');
        } else {
            window.location.reload();
        }
    };

    return (
        <main className="flex flex-1 items-center justify-center px-6 py-16">
            <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/60 p-10 text-center shadow-2xl shadow-sky-900/30 backdrop-blur">
                <h1 className="text-3xl font-semibold text-sky-100">
                    {t('pwa.offlineTitle')}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                    {t('pwa.offlineDescription')}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                    {t('pwa.offlineHint')}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        asChild
                        size="sm"
                        className="bg-sky-600 text-white hover:bg-sky-500"
                    >
                        <Link to="/">{t('pwa.goHome')}</Link>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-sky-500/40 text-sky-200 hover:bg-sky-500/10"
                        onClick={handleRetry}
                    >
                        {t('pwa.retry')}
                    </Button>
                </div>
            </section>
        </main>
    );
}
