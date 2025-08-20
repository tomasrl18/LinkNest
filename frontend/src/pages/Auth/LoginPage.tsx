import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from '../../context/AuthProvider';
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../../animations/pageVariants";
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const email = e.currentTarget.email.value;
        const pass  = e.currentTarget.password.value;

        try {
            setLoading(true);
            await signIn(email, pass);
            toast.success(t('auth.toastSuccess'));
            navigate('/links');
        } catch (err) {
            console.error(err);
            toast.error(t('auth.toastError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className='h-[calc(100dvh-80px)] flex items-start justify-center pt-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950'
        >
            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl bg-gray-800/70 backdrop-blur
                   ring-1 ring-white/10 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
            >
                <div className="p-8 space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-100">{t('auth.login')}</h2>

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder={t('auth.email')}
                        className="input input-bordered w-full bg-gray-900/50 text-gray-100"
                        disabled={loading}
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder={t('auth.password')}
                            className="input input-bordered w-full bg-gray-900/50 text-gray-100 pr-10"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute inset-y-0 right-0 z-10 flex items-center px-3 text-gray-400 hover:text-gray-200"
                            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? t('auth.loggingIn') : t('auth.enter')}
                    </button>
                    <p className="text-center text-sm text-gray-400">
                        {t('auth.askAccount')}{' '}
                        <Link to="/register" className="text-indigo-300 hover:underline">
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </div>
            </motion.form>
        </motion.section>
    );
};
