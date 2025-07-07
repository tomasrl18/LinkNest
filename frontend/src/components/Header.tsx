import { Link, useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthProvider";

export function Header() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        setTimeout(() => navigate("/login"), 150);
    };

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="sticky top-0 inset-x-0 z-50 bg-gray-900/80 backdrop-blur border-b border-gray-800"
        >
            <div className="max-w-6xl mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent"
                >
                    Link<span className="text-indigo-200">Nest</span>
                </Link>

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
                            Mis enlaces
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-semibold text-indigo-300"
                                    : "text-gray-300 hover:text-indigo-200 transition-colors"
                            }
                        >
                            Mis categorías
                        </NavLink>

                        <NavLink
                            to="/links/new"
                            className={({ isActive }) =>
                                isActive
                                    ? "font-semibold text-indigo-300"
                                    : "text-gray-300 hover:text-indigo-200 transition-colors"
                            }
                        >
                            Añadir enlace
                        </NavLink>
                    </nav>
                )}

                {user ? (
                    <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow justify-self-end cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <div className="flex gap-2 justify-self-end">
                        <Button
                            asChild
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow cursor-pointer"
                        >
                            <Link to="/login">Login</Link>
                        </Button>
                    </div>
                )}
            </div>
        </motion.header>
    );
}
