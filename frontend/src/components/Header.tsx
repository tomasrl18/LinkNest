import { Link, useNavigate } from "react-router-dom";
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
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent"
                >
                    Link<span className="text-indigo-200">Nest</span>
                </Link>

                {user ? (
                    <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        asChild
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                    >
                        <Link to="/login">Login</Link>
                    </Button>
                )}
            </div>
        </motion.header>
    );
}
