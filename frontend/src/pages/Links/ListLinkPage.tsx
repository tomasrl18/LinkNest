import { useMemo, useState } from "react";
import { useLinks } from "../../hooks/useLinks";
import { useCategories } from "../../hooks/useCategories";
import LinkCard from "../../components/LinkCard";
import { Sparkles, Heart, Search } from "lucide-react";

export function ListLinkPage() {
    const { links, updateLink /*, deleteLink*/ } = useLinks();
    const { categories } = useCategories();
    const [search, setSearch] = useState("");
    const [onlyFavs, setOnlyFavs] = useState(false);
    const [categoryId, setCategoryId] = useState("");

    const filtered = useMemo(() => {
        return links.filter(l => {
            const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase());
            const matchCategory = !categoryId || l.category_id === categoryId;
            const matchFav = !onlyFavs || l.favorite;
            return matchSearch && matchCategory && matchFav;
        });
    }, [links, search, categoryId, onlyFavs]);

    const toggleFav = async (id: string, fav: boolean) => {
        try {
            await updateLink(id, { favorite: !fav });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="min-h-screen bg-darkblue text-white flex flex-col items-center">
            <section className="w-full max-w-4xl px-4 py-10 space-y-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 flex items-center gap-2 bg-gray-900/60 backdrop-blur rounded-xl px-4 py-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Buscar enlaces..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm"
                        />
                    </div>
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="bg-gray-900/60 backdrop-blur rounded-xl px-4 py-2 text-sm"
                    >
                        <option value="">Todas</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={onlyFavs} onChange={e => setOnlyFavs(e.target.checked)} />
                        Sólo favoritos
                    </label>
                </header>

                {filtered.length ? (
                    <ul className="space-y-3">
                        {filtered.map(link => (
                            <li key={link.id} className="group relative">
                                <LinkCard link={link} />
                                <button
                                    onClick={() => toggleFav(link.id, link.favorite)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={link.favorite ? "Quitar de favoritos" : "Marcar como favorito"}
                                >
                                    <Heart
                                        size={18}
                                        className={link.favorite ? "fill-pink-600 text-pink-600" : "text-gray-400"}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400 flex flex-col items-center gap-1">
                        <Sparkles size={18} /> No se encontraron enlaces.
                    </p>
                )}
            </section>
        </main>
    );
}
