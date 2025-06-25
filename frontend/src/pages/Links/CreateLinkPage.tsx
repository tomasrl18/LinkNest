import { useState } from "react";
import { useLinks } from "../../hooks/useLinks";
import type { Link } from "../../types/link";
import { useAuth } from "../../context/AuthProvider";
import { Loader2 } from "lucide-react";

export function CreateLinkPage() {
    const { user } = useAuth();
    const { addLink } = useLinks();

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        category: "",
        tags: "",
        favorite: false,
    });
    const [loading, setLoading] = useState(false);

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
            category: form.category.trim() || null,
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
            setForm({ url: "", title: "", description: "", category: "", tags: "", favorite: false });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-darkblue text-white flex flex-col items-center">
            <section className="w-full max-w-lg px-4 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-gray-900/60 backdrop-blur rounded-2xl p-6 shadow-xl"
                >
                    <header className="text-center space-y-1">
                        <h1 className="text-xl font-semibold">Nuevo enlace</h1>
                        <p className="text-sm text-gray-400">Completa los campos necesarios</p>
                    </header>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="url" className="text-sm font-medium">URL <span className="text-pink-500">*</span></label>
                        <input
                            id="url"
                            name="url"
                            type="url"
                            required
                            value={form.url}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/articulo"
                            className="rounded-xl px-3 py-2 text-sm bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="title" className="text-sm font-medium">Título</label>
                            <input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Cómo ser productivo"
                                className="rounded-xl px-3 py-2 text-sm bg-gray-800"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                            <input
                                id="category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Lectura"
                                className="rounded-xl px-3 py-2 text-sm bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Pequeño resumen o notas..."
                            className="rounded-xl px-3 py-2 text-sm bg-gray-800 resize-none"
                        />
                        <span className="text-xs text-gray-500 text-right">
                            {form.description.length}/240
                        </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                            <input
                                id="tags"
                                name="tags"
                                value={form.tags}
                                onChange={handleChange}
                                placeholder="web, ui, inspiración"
                                className="rounded-xl px-3 py-2 text-sm bg-gray-800"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm pt-6 sm:pt-0">
                            <input
                                type="checkbox"
                                name="favorite"
                                checked={form.favorite}
                                onChange={handleChange}
                            />
                            Marcar como favorito
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2 text-sm font-medium disabled:opacity-60"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Añadir enlace
                    </button>
                </form>
            </section>
        </main>
    );
}
