/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

export function CreateCategoryDialog({ open, onClose, onCreate }: CreateCategoryDialogProps) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(t('categories.actions.nameError'));
            return;
        }

        setError("");
        setLoading(true);

        try {
            await onCreate(name.trim());
            setName("");
            onClose();
        } catch (err) {
            setError(t('categories.actions.create.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900/90 border border-gray-700/40 rounded-2xl shadow-2xl p-6 w-full max-w-xs relative"
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 40, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.35 }}
                    >
                        <button
                            className="absolute top-2 right-2 btn btn-xs btn-ghost text-gray-400 hover:text-white"
                            onClick={onClose}
                            aria-label={t('categories.buttons.close')}
                            type="button"
                        >
                            <X size={18} />
                        </button>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h2 className="text-lg font-semibold text-white">
                                    {t('categories.actions.create.title')}
                                </h2>
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full bg-gray-800/80 text-white rounded-xl"
                                placeholder={t('categories.actions.name')}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                                maxLength={32}
                            />
                            {error && <span className="text-xs text-pink-400 pl-1">{error}</span>}
                            <button
                                type="submit"
                                className="btn btn-primary w-full rounded-xl mt-2"
                                disabled={loading}
                            >
                                {loading ? t('categories.actions.create.form.creating') : t('categories.actions.create.form.create')}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
