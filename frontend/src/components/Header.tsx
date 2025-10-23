import { Link, useNavigate, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthProvider";
import { LanguageSwitcher } from "../components/lang/LangSelector";
import { useTranslation } from "react-i18next";

import { useCallback, useMemo, useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

export function Header() {
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInstallHelp, setShowInstallHelp] = useState(false);
    const { isInstallable, promptInstall, requiresManualInstall } = usePwaInstall();

    const iosInstallSteps = useMemo(() => {
        if (!showInstallHelp) return [] as string[];
        return t('pwa.manualInstallSteps', { returnObjects: true }) as string[];
    }, [showInstallHelp, t]);

    const installTitleId = 'ios-install-title';
    const installDescriptionId = 'ios-install-description';

    const handleLogout = async () => {
        await signOut();
        setTimeout(() => navigate("/login"), 150);
    };

    const handleInstallClick = useCallback(async () => {
        const outcome = await promptInstall();
        if (outcome === 'manual') {
            setShowInstallHelp(true);
        }
        return outcome;
    }, [promptInstall]);

    return (
        <>
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="sticky top-0 inset-x-0 z-50 bg-gray-900/80 backdrop-blur border-b border-gray-800"
        >
            <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent"
                    aria-label={t('app.name')}
                    title={t('app.name')}
                >
                    Link<span className="text-indigo-200">Nest</span>
                </Link>

                <nav className="hidden sm:flex justify-self-center gap-6 text-sm">
                    {user && (
                        <nav className="hidden sm:flex justify-self-center gap-6 text-sm">
                            <NavLink
                                to="/links"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-semibold text-indigo-300"
                                        : "text-gray-300 hover:text-indigo-200 transition-colors"
                                }
                            >
                                {t('nav.links')}
                            </NavLink>

                            <NavLink
                                to="/categories"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-semibold text-indigo-300"
                                        : "text-gray-300 hover:text-indigo-200 transition-colors"
                                }
                            >
                                {t('nav.categories')}
                            </NavLink>

                            <NavLink
                                to="/usage"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-semibold text-indigo-300"
                                        : "text-gray-300 hover:text-indigo-200 transition-colors"
                                }
                            >
                                {t('nav.usage')}
                            </NavLink>

                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-semibold text-indigo-300"
                                        : "text-gray-300 hover:text-indigo-200 transition-colors"
                                }
                            >
                                {t('nav.profile')}
                            </NavLink>

                            <NavLink
                                to="/links/new"
                                className={({ isActive }) =>
                                    isActive
                                        ? "font-semibold text-indigo-300"
                                        : "text-gray-300 hover:text-indigo-200 transition-colors"
                                }
                            >
                                {t('nav.addLink')}
                            </NavLink>
                        </nav>
                    )}
                </nav>
                <div className="flex items-center gap-2 justify-self-end">
                    {isInstallable && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="hidden text-sky-200 border-sky-500/40 hover:bg-sky-500/10 sm:inline-flex"
                            onClick={() => void handleInstallClick()}
                            aria-label={
                                requiresManualInstall ? t('pwa.manualInstallTitle') : t('pwa.install')
                            }
                        >
                            <Download size={16} />
                            {t('pwa.install')}
                        </Button>
                    )}
                    <LanguageSwitcher />

                    {user && (
                        <button
                            className="sm:hidden p-2 rounded-md text-gray-300 hover:text-indigo-200 transition-colors"
                            onClick={() => setMenuOpen(true)}
                            aria-label={t('nav.openMenu')}
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    {user ? (
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow cursor-pointer"
                            onClick={handleLogout}
                        >
                            {t('auth.logout')}
                        </Button>
                    ) : (
                        <Button
                            asChild
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow cursor-pointer"
                        >
                            <Link to="/login">
                                {t('auth.login')}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </motion.header>

        <AnimatePresence>
            {menuOpen && user && (
                <motion.div
                    key="mobile-menu"
                    className="fixed inset-0 z-50 flex sm:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />
                    <motion.nav
                        initial={{ x: -260 }}
                        animate={{ x: 0 }}
                        exit={{ x: -260 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="relative w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-4 text-sm"
                    >
                        <button
                            className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-white"
                            onClick={() => setMenuOpen(false)}
                            aria-label={t('nav.closeMenu')}
                        >
                            <X size={18} />
                        </button>
                        {isInstallable && (
                            <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => {
                                    void handleInstallClick().finally(() => setMenuOpen(false));
                                }}
                            >
                                <Download size={16} />
                                {t('pwa.install')}
                            </Button>
                        )}
                        <NavLink
                            to="/links"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'font-semibold text-indigo-300'
                                    : 'text-gray-300 hover:text-indigo-200 transition-colors'
                            }
                        >
                            {t('nav.links')}
                        </NavLink>
                        <NavLink
                            to="/categories"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'font-semibold text-indigo-300'
                                    : 'text-gray-300 hover:text-indigo-200 transition-colors'
                            }
                        >
                            {t('nav.categories')}
                        </NavLink>
                        <NavLink
                            to="/usage"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'font-semibold text-indigo-300'
                                    : 'text-gray-300 hover:text-indigo-200 transition-colors'
                            }
                        >
                            {t('nav.usage')}
                        </NavLink>
                        <NavLink
                            to="/profile"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'font-semibold text-indigo-300'
                                    : 'text-gray-300 hover:text-indigo-200 transition-colors'
                            }
                        >
                            {t('nav.profile')}
                        </NavLink>
                        <NavLink
                            to="/links/new"
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'font-semibold text-indigo-300'
                                    : 'text-gray-300 hover:text-indigo-200 transition-colors'
                            }
                        >
                            {t('nav.addLink')}
                        </NavLink>
                    </motion.nav>
                </motion.div>
            )}
            {showInstallHelp && (
                <motion.div
                    key="ios-install"
                    className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowInstallHelp(false)}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={installTitleId}
                        aria-describedby={installDescriptionId}
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.94, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                        className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/95 p-6 text-slate-100 shadow-2xl"
                    >
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:text-slate-200"
                            onClick={() => setShowInstallHelp(false)}
                            aria-label={t('nav.closeMenu')}
                        >
                            <X size={16} />
                        </button>
                        <h2 id={installTitleId} className="text-lg font-semibold text-sky-200">
                            {t('pwa.manualInstallTitle')}
                        </h2>
                        <p id={installDescriptionId} className="mt-2 text-sm text-slate-200/80">
                            {t('pwa.manualInstallSubtitle')}
                        </p>
                        <ol className="mt-4 space-y-3 text-left text-sm">
                            {iosInstallSteps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-200">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 text-slate-100">{step}</span>
                                </li>
                            ))}
                        </ol>
                        <Button
                            type="button"
                            className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-500"
                            onClick={() => setShowInstallHelp(false)}
                        >
                            {t('pwa.manualInstallDismiss')}
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
