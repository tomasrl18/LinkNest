import { useState } from "react";
import { useLinks } from "../../hooks/useLinks";
import type { Link } from "../../types/link";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
import { Bookmark, Loader2, Plus, Link as LinkIcon } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { CreateCategoryDialog } from "../../components/CreateCategoryDialog";

export function CreateLinkPage() {
    const { user } = useAuth();
    const { addLink } = useLinks();
    const { categories, createCategory, fetchCategories } = useCategories();

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        category_id: "",
        tags: "",
        favorite: false,
    });
    const [loading, setLoading] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value, checked } = e.target as HTMLInputElement;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.url.trim()) return;

        const payload: Omit<Link, "id" | "created_at"> = {
            url: form.url.trim(),
            title: form.title.trim() || null,
            description: form.description.trim() || null,
            category_id: form.category_id.trim() || null,
            tags:
                form.tags
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean) || null,
            favorite: form.favorite,
            user_id: user?.id ?? "",
        };

        try {
            setLoading(true);
            await addLink(payload);
            setForm({ url: "", title: "", description: "", category_id: "", tags: "", favorite: false });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center relative overflow-hidden">
            <CreateCategoryDialog
                open={categoryDialogOpen}
                onClose={() => setCategoryDialogOpen(false)}
                onCreate={async (name) => {
                    const newCat = await createCategory({ name, user_id: user?.id });
                    await fetchCategories();
                    if (newCat && newCat.id) {
                        setForm(prev => ({ ...prev, category_id: newCat.id }));
                    }
                }}
            />
            <span className="absolute -top-1 -right-1 opacity-10 pointer-events-none select-none z-0">
                <LinkIcon size={320} />
            </span>
            <section className="w-full max-w-lg px-4 py-10 z-10">
                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-7 bg-gray-900/70 backdrop-blur-2xl border border-gray-700/40 shadow-2xl rounded-3xl p-8 relative overflow-hidden"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                >
                    <header className="text-center space-y-2">
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Bookmark className="mx-auto text-indigo-400 drop-shadow-lg" size={44} />
                        </motion.div>
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">Nuevo enlace</h1>
                    </header>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="url" className="text-sm font-medium pl-1">URL <span className="text-pink-500">*</span></label>
                            <input
                                id="url"
                                name="url"
                                type="url"
                                required
                                value={form.url}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/articulo"
                                className="input input-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80 focus:ring-2 focus:ring-pink-500 outline-none transition-all duration-200"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="title" className="text-sm font-medium pl-1">Título</label>
                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Cómo ser productivo"
                                    className="input input-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="category_id" className="text-sm font-medium pl-1">Categoría</label>
                                <div className="flex gap-2 items-center">
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                                        className="select select-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80"
                                    >
                                        <option value="">Sin categoría</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setCategoryDialogOpen(true)}
                                        className="btn btn-xs btn-outline btn-primary rounded-lg px-2 py-1 font-medium min-h-0 h-8"
                                    >
                                        <Plus size={14} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="description" className="text-sm font-medium pl-1">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                maxLength={240}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Pequeño resumen o notas..."
                                className="textarea textarea-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80 resize-none"
                            />
                            <span className="text-xs text-gray-500 text-right">{form.description.length}/240</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="tags" className="text-sm font-medium pl-1">Tags</label>
                                <input
                                    id="tags"
                                    name="tags"
                                    value={form.tags}
                                    onChange={handleChange}
                                    placeholder="web, ui, inspiración"
                                    className="input input-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80"
                                />
                                <div className="flex flex-wrap gap-1 mt-1 min-h-[24px]">
                                    {form.tags.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
                                        <span key={i} className="badge badge-sm badge-info bg-gradient-to-r from-indigo-400 to-pink-400 text-white border-0 opacity-80">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 mb-1 sm:mb-0">
                                <input
                                    type="checkbox"
                                    name="favorite"
                                    id="favorite"
                                    checked={form.favorite}
                                    onChange={handleChange}
                                    className="checkbox checkbox-pink"
                                />
                                <label htmlFor="favorite" className="text-sm font-medium cursor-pointer select-none">Favorito</label>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-pink-500 to-fuchsia-500 hover:from-indigo-700 hover:to-fuchsia-600 py-3 text-base font-semibold shadow-lg transition-all duration-200 disabled:opacity-60 mt-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        <span>Añadir enlace</span>
                    </motion.button>
                </motion.form>
            </section>
        </main>
    );
}
