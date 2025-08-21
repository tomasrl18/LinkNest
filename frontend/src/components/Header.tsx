import { Link, useNavigate, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthProvider";
import { LanguageSwitcher } from "../components/lang/LangSelector";
import { useTranslation } from "react-i18next";

import { useState } from "react";

export function Header() {
    const { t } = useTranslation();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        setTimeout(() => navigate("/login"), 150);
    };

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
        </AnimatePresence>
        </>
    );
}
