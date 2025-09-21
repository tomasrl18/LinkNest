import { useCallback, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from '../../context/AuthProvider';
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../../animations/pageVariants";
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const { t } = useTranslation();

    const mapAuthError = useCallback((error: unknown) => {
        if (error instanceof Error) {
            const message = error.message.toLowerCase();

            if (message.includes('invalid login credentials')) {
                return t('auth.errors.invalidCredentials');
            }

            if (message.includes('email rate limit reached')) {
                return t('auth.errors.rateLimited');
            }
        }

        return t('auth.errors.default');
    }, [t]);

    const isSubmitting = useMemo(() => loading || oauthLoading, [loading, oauthLoading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        const email = e.currentTarget.email.value;
        const pass  = e.currentTarget.password.value;

        try {
            setFormError(null);
            setLoading(true);
            await signIn(email, pass);
            toast.success(t('auth.toastSuccess'));
            navigate('/links');
        } catch (err) {
            const errorMessage = mapAuthError(err);
            setFormError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (isSubmitting) return;

        try {
            setFormError(null);
            setOauthLoading(true);
            await signInWithGoogle();
        } catch (err) {
            const errorMessage = mapAuthError(err);
            setFormError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setOauthLoading(false);
        }
    };

    return (
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className='flex-1 flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950'
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
                        disabled={isSubmitting}
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder={t('auth.password')}
                            className="input input-bordered w-full bg-gray-900/50 text-gray-100 pr-10"
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute inset-y-0 right-0 z-10 flex items-center px-3 text-gray-400 hover:text-gray-200"
                            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                            disabled={isSubmitting}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? t('auth.loggingIn') : t('auth.enter')}
                    </button>

                    <div className="flex items-center gap-3 text-gray-400 text-xs uppercase">
                        <span className="flex-1 h-px bg-gray-700" aria-hidden="true" />
                        <span>{t('auth.or')}</span>
                        <span className="flex-1 h-px bg-gray-700" aria-hidden="true" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="btn w-full rounded-xl bg-white text-gray-900 hover:bg-gray-200 flex items-center justify-center gap-3"
                        disabled={isSubmitting}
                    >
                        {oauthLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex h-5 w-5 overflow-hidden rounded-full">
                                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.4-5.26C33.46 3.58 29.23 1.5 24 1.5 14.9 1.5 7.02 7.36 4.08 15.44l6.99 5.42C12.56 15.06 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.5 24.5c0-1.56-.15-3.06-.45-4.5H24v9h12.7c-.55 2.86-2.24 5.28-4.76 6.9l7.26 5.63C43.84 37.06 46.5 31.28 46.5 24.5z" />
                                    <path fill="#FBBC05" d="M11.07 28.46c-.5-1.48-.79-3.05-.79-4.68s.29-3.2.79-4.68l-6.99-5.42C2.87 16.53 1.5 20.08 1.5 23.78s1.37 7.25 3.58 10.1l6.99-5.42z" />
                                    <path fill="#34A853" d="M24 46.5c5.23 0 9.63-1.72 12.84-4.68l-7.26-5.63c-2.02 1.36-4.6 2.16-7.58 2.16-6.26 0-11.44-5.56-12.93-12.36l-6.99 5.42C7.02 40.64 14.9 46.5 24 46.5z" />
                                </svg>
                            </span>
                        )}
                        <span className="font-medium">{oauthLoading ? t('auth.loggingIn') : t('auth.googleContinue')}</span>
                    </button>

                    {formError && (
                        <p className="text-sm text-red-400 text-center" role="alert">
                            {formError}
                        </p>
                    )}

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
