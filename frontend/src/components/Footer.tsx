import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="font-bold backdrop-blur border-t text-sm transition-colors duration-300 bg-white/80 border-gray-200 text-gray-600 dark:bg-gray-900/80 dark:border-gray-800 dark:text-gray-500">
            <div className="container mx-auto flex w-full flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <Button asChild variant="link" className="h-auto p-0 text-indigo-700 dark:text-indigo-300">
                        <Link to="/privacy-policy">{t('privacy.title')}</Link>
                    </Button>
                    <Button asChild variant="link" className="h-auto p-0 text-indigo-700 dark:text-indigo-300">
                        <Link to="/terms-of-service">{t('terms.title')}</Link>
                    </Button>
                </div>
                <span className="text-center sm:text-right">
                    {t('home.footer')}{' '}
                    <a href="https://github.com/tomasrl18" target="_blank" rel="noreferrer" className="text-indigo-700 dark:text-indigo-400 hover:underline">
                        Tomás
                    </a>
                    {' — © '}{new Date().getFullYear()} LinkNest
                </span>
            </div>
        </footer>
    );
}
