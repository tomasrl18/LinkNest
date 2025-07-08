import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCategoryMembers } from '../../hooks/useCategoryMembers';

interface ShareCategoryDialogProps {
    open: boolean;
    categoryId: string;
    onClose: () => void;
}

export function ShareCategoryDialog({ open, categoryId, onClose }: ShareCategoryDialogProps) {
    const { members, fetchMembers, addMember, removeMember } = useCategoryMembers(categoryId);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) fetchMembers();
    }, [open, fetchMembers]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('El email es obligatorio');
            return;
        }
        setError('');
        try {
            setLoading(true);
            await addMember(email.trim());
            setEmail('');
        } catch {
            setError('No se pudo añadir');
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
                        className="bg-gray-900/90 border border-gray-700/40 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative"
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 40, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.35 }}
                    >
                        <button
                            className="absolute top-2 right-2 btn btn-xs btn-ghost text-gray-400 hover:text-white"
                            onClick={onClose}
                            aria-label="Cerrar"
                            type="button"
                        >
                            <X size={18} />
                        </button>
                        <h2 className="text-lg font-semibold mb-3">Compartir categoría</h2>
                        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                            <input
                                type="email"
                                className="input input-bordered flex-1 bg-gray-800/80 rounded-xl"
                                placeholder="Email del usuario"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary" disabled={loading}>Añadir</button>
                        </form>
                        {error && <p className="text-xs text-pink-400 mb-2">{error}</p>}
                        <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {members.map(m => (
                                <li key={m.id} className="flex justify-between items-center bg-gray-800/50 px-3 py-1 rounded-lg">
                                    <span className="text-sm">{m.profile?.email || m.user_id}</span>
                                    <button
                                        onClick={() => removeMember(m.id)}
                                        className="btn btn-xs btn-outline btn-error rounded"
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}