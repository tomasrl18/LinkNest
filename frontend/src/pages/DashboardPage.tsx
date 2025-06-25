/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { useLinks } from "../hooks/useLinks";
import type { Link } from "../types/link";
import LinkCard from "../components/LinkCard";
import { useAuth } from "../context/AuthProvider";

export function DashboardPage() {
    const { user } = useAuth();
    const { links, addLink, updateLink, deleteLink } = useLinks();

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        category: "",
        tags: "",
        favorite: false,
    });

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    const filteredLinks = useMemo(() => {
        return links.filter((link) => {
            const matchesSearch =
                !search ||
                link.title?.toLowerCase().includes(search.toLowerCase()) ||
                link.url.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
                !filterCategory ||
                (link.category ?? "").toLowerCase() === filterCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [links, search, filterCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
        }));
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
                    .map((t) => t.trim())
                    .filter(Boolean) || null,
            favorite: form.favorite,
            user_id: user?.id ?? "",
        };

        try {
            await addLink(payload);
            setForm({
                url: "",
                title: "",
                description: "",
                category: "",
                tags: "",
                favorite: false,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-darkblue text-white">
            <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 p-4">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3 rounded-xl p-4 shadow"
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="URL *"
                            className="w-full rounded border px-3 py-2 text-sm"
                            required
                        />
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Título"
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Categoría"
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="Tags (separados por comas)"
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                        rows={2}
                        className="w-full rounded border px-3 py-2 text-sm"
                    />
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="favorite"
                            checked={form.favorite}
                            onChange={handleChange}
                        />
                        Favorito
                    </label>
                    <button
                        type="submit"
                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Añadir enlace
                    </button>
                </form>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm sm:max-w-xs"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar categoría"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full rounded border px-3 py-2 text-sm sm:max-w-xs"
                    />
                </div>

                <div className="space-y-3">
                    {filteredLinks.length ? (
                        filteredLinks.map((link) => (
                            <LinkCard
                                key={link.id}
                                link={link}
                            />
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500">
                            Aún no hay enlaces.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
