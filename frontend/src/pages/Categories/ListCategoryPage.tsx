import { useState } from "react";
import { Sparkles, Plus, Pencil, Trash, Share2 } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../context/AuthProvider";
import { CreateCategoryDialog } from "../../components/categories/CreateCategoryDialog";
import { EditCategoryDialog } from "../../components/categories/EditCategoryDialog";
import ConfirmDeleteCategoryDialog from "../../components/categories/ConfirmDeleteCategoryDialog";
import { ShareCategoryDialog } from "../../components/categories/ShareCategoryDialog";
import type { Category } from "../../types/category";
import { toast } from "react-hot-toast";

export function ListCategoryPage() {
    const { user } = useAuth();
    const { categories, createCategory, updateCategory, deleteCategory, fetchCategories } = useCategories();
    const [createOpen, setCreateOpen] = useState(false);
    const [editModal, setEditModal] = useState<{ open: boolean; category: Category | null }>({ open: false, category: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [shareModal, setShareModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    const handleCreate = async (name: string) => {
        try {
            await createCategory({ name, user_id: user?.id });
            toast.success("Categoría creada");
            await fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error("Error al crear la categoría");
        }
    };

    const handleEdit = async (name: string) => {
        if (!editModal.category) return;
        try {
            await updateCategory(editModal.category.id, { name });
            toast.success("Categoría actualizada");
            setEditModal({ open: false, category: null });
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar la categoría");
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteCategory(deleteModal.id);
            toast.success("Categoría eliminada");
            setDeleteModal({ open: false, id: null });
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar la categoría");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center">
            <CreateCategoryDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreate}
            />
            <EditCategoryDialog
                open={editModal.open}
                initialName={editModal.category?.name || ""}
                onClose={() => setEditModal({ open: false, category: null })}
                onSave={handleEdit}
            />
            <ConfirmDeleteCategoryDialog
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, id: null })}
                onConfirm={handleDelete}
            />
            <ShareCategoryDialog
                open={shareModal.open}
                categoryId={shareModal.id ?? ''}
                onClose={() => setShareModal({ open: false, id: null })}
            />
            <section className="container mx-auto px-4 py-10 space-y-6">
                <header className="flex items-center justify-between bg-gray-900/70 rounded-2xl px-6 py-4 shadow-lg border border-gray-800">
                    <h1 className="text-xl font-semibold">Categorías</h1>
                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="btn btn-sm btn-primary rounded-lg"
                    >
                        <Plus size={16} /> Nueva
                    </button>
                </header>
                {categories.length ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map(c => (
                            <li key={c.id} className="transition-all duration-200 group flex items-center justify-between bg-gray-900/70 border border-gray-800 rounded-xl p-3 shadow-lg hover:shadow-2xl hover:border-pink-600 hover:scale-[1.025]">
                                <span className="font-medium">{c.name}</span>
                                <div className="flex gap-3 opacity-80">
                                    <button
                                        onClick={() => setEditModal({ open: true, category: c })}
                                        className="hover:text-indigo-400 transition-colors cursor-pointer"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, id: c.id })}
                                        className="hover:text-red-500 transition-colors cursor-pointer"
                                        title="Eliminar"
                                    >
                                        <Trash size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShareModal({ open: true, id: c.id })}
                                        className="hover:text-indigo-400 transition-colors cursor-pointer"
                                        title="Compartir"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400 flex flex-col items-center gap-1">
                        <Sparkles size={18} /> No se encontraron categorías.
                    </p>
                )}
            </section>
        </main>
    );
}

export default ListCategoryPage;
