import { motion } from "framer-motion";
import { useState } from "react";
import { pageVariants, pageTransition } from "../../animations/pageVariants";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-hot-toast";

export const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = e.currentTarget.email.value;
        try {
            await resetPassword(email);
            setSent(true);
            toast.success("Correo enviado");
        } catch (err) {
            console.error(err);
            toast.error("Error al enviar el correo");
        }
    };

    return (
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="h-[calc(100dvh-80px)] flex items-start justify-center pt-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
        >
            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl bg-gray-800/70 backdrop-blur ring-1 ring-white/10 shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
            >
                <div className="p-8 space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-100">Recuperar contraseña</h2>
                    {sent ? (
                        <p className="text-gray-300 text-sm">Revisa tu correo para continuar con el proceso.</p>
                    ) : (
                        <>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Email"
                                className="input input-bordered w-full bg-gray-900/50 text-gray-100"
                            />
                            <button type="submit" className="btn btn-primary w-full rounded-xl">
                                Enviar enlace
                            </button>
                        </>
                    )}
                </div>
            </motion.form>
        </motion.section>
    );
};
