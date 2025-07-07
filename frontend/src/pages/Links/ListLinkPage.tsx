
import { useMemo, useState } from "react";
import { useLinks } from "../../hooks/useLinks";
import { useCategories } from "../../hooks/useCategories";
import LinkCard from "../../components/links/LinkCard";
import { Sparkles, Search, Star, Trash, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDeleteLinkDialog from "../../components/links/ConfirmDeleteLinkDialog";
import { toast } from "react-hot-toast";

export function ListLinkPage() {
    const { links, updateLink, deleteLink } = useLinks();
    const { categories } = useCategories();
    const [search, setSearch] = useState("");
    const [onlyFavs, setOnlyFavs] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    const filtered = useMemo(() => {
        return links.filter(l => {
            const matchSearch = !search || 
                l.title?.toLowerCase().includes(search.toLowerCase()) ||
                l.url.toLowerCase().includes(search.toLowerCase()) ||
                l.description?.toLowerCase().includes(search.toLowerCase()) ||
                l.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
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

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteLink(deleteModal.id);
            setDeleteModal({ open: false, id: null });
            toast.success("Enlace eliminado");
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar el enlace");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center">
            <ConfirmDeleteLinkDialog
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, id: null })}
                onConfirm={handleDelete}
            />
            <section className="w-full max-w-4xl px-4 py-10 space-y-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end w-full bg-gray-900/70 rounded-2xl px-6 py-4 shadow-lg border border-gray-800 mb-4">
                    <div className="flex-1 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1 flex items-center gap-2 bg-gray-800/70 rounded-xl px-4 py-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Buscar enlaces..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <div className="flex items-center gap-2 bg-gray-800/70 rounded-xl px-3 py-1">
                            <select
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                className="backdrop-blur rounded-xl px-3 py-1 text-sm text-gray-100 shadow-inner transition-all duration-200 outline-none"
                            >
                                <option value="" className="bg-gray-900 text-gray-300">Todas</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} className="bg-gray-900 text-gray-200">{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOnlyFavs(v => !v)}
                            className={`flex items-center gap-2 bg-gray-800/70 rounded-xl px-3 py-1 cursor-pointer select-none transition-colors border border-transparent focus:outline-none ${onlyFavs ? 'border-yellow-400/60 bg-yellow-900/30' : ''}`}
                            title={onlyFavs ? "Mostrar todos" : "Sólo favoritos"}
                        >
                            <Star size={18} className={onlyFavs ? "fill-yellow-400 text-yellow-400 drop-shadow" : "text-gray-400"} />
                            <span className="text-sm">Favoritos</span>
                        </button>
                    </div>
                </header>

                {filtered.length ? (
                    <ul className="space-y-3">
                        {filtered.map(link => (
                            <li key={link.id} className="group relative">
                                <div
                                    className="transition-all duration-200 bg-gray-900/70 border border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:border-pink-600 hover:scale-[1.025] flex items-stretch"
                                >
                                    <LinkCard link={link} />
                                    <Link
                                        to={`/links/${link.id}/edit`}
                                        className="cursor-pointer absolute top-3 right-20 z-10 p-1 shadow opacity-80"
                                        title="Editar enlace"
                                    >
                                        <Pencil size={20} className="text-gray-400 hover:text-indigo-400 transition-colors" />
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, id: link.id })}
                                        className="cursor-pointer absolute top-3 right-12 z-10 p-1 shadow opacity-80"
                                        title="Eliminar enlace"
                                    >
                                        <Trash size={20} className="text-gray-400 hover:text-red-500 transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => toggleFav(link.id, link.favorite)}
                                        className="cursor-pointer absolute top-3 right-4 z-10 p-1 shadow opacity-80"
                                        title={link.favorite ? "Quitar de favoritos" : "Marcar como favorito"}
                                    >
                                        <Star
                                            size={20}
                                            className={
                                                `transition-all duration-300 transform ${
                                                    link.favorite
                                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow scale-125 rotate-12'
                                                        : 'text-gray-400 scale-100 rotate-0'
                                                }`
                                            }
                                        />
                                    </button>
                                </div>
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

export default ListLinkPage;
