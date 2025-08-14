import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-900/80 backdrop-blur border-t border-gray-800 text-gray-500 text-sm">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 px-4 py-6">
                <Button asChild variant="link" className="text-indigo-300 p-0 h-auto">
                    <Link to="/privacy-policy">{t('privacy.title')}</Link>
                </Button>
                <span>
                    {t('home.footer')}{' '}
                    <a href="https://github.com/tomasrl18" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                        Tomás
                    </a>
                    {' — © '}{new Date().getFullYear()} LinkNest
                </span>
            </div>
        </footer>
    );
}