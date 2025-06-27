import { useAuth } from '../context/AuthProvider';
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../animations/pageVariants";
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = e.currentTarget.email.value;
        const pass  = e.currentTarget.password.value;

        try {
            await signUp(email, pass);
            navigate('/links');
        } catch (err) {
            console.error(err);
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
                className="w-full max-w-sm rounded-2xl bg-gray-800/70 backdrop-blur ring-1 ring-white/10 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
            >
                <div className="p-8 space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-100">Crea tu cuenta</h2>

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        className="input input-bordered w-full bg-gray-900/50 text-gray-100"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Contraseña"
                        className="input input-bordered w-full bg-gray-900/50 text-gray-100"
                    />

                    <button type="submit" className="btn btn-primary w-full rounded-xl">
                        Registrarse
                    </button>
                </div>
            </motion.form>
        </motion.section>
    );
};
