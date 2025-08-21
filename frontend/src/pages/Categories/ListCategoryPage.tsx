import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useCategoryTree } from "../../hooks/useCategoryTree";
import { useAuth } from "../../context/AuthProvider";
import { CreateCategoryDialog } from "../../components/categories/CreateCategoryDialog";
import { EditCategoryDialog } from "../../components/categories/EditCategoryDialog";
import ConfirmDeleteCategoryDialog from "../../components/categories/ConfirmDeleteCategoryDialog";
import { CategoryTree } from "../../components/categories/CategoryTree";
import type { CategoryNode } from "../../lib/categoryTree";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function findCategory(nodes: CategoryNode[], id: string): CategoryNode | null {
    for (const n of nodes) {
        if (n.id === id) return n;
        const child = findCategory(n.children, id);
        if (child) return child;
    }
    return null;
}

export function ListCategoryPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { tree, create, rename, remove, reorder } = useCategoryTree();
    const [createModal, setCreateModal] = useState<{ open: boolean; parentId: string | null }>({ open: false, parentId: null });
    const [renameModal, setRenameModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    const handleCreate = async (name: string) => {
        try {
            await create(name, createModal.parentId, user?.id);
            toast.success(t('categories.actions.create.title'));
        } catch (err) {
            console.error(err);
            toast.error(t('categories.actions.create.error'));
        }
    };

    const handleRename = async (name: string) => {
        if (!renameModal.id) return;
        try {
            await rename(renameModal.id, name);
            toast.success(t('categories.actions.edit.title'));
        } catch (err) {
            console.error(err);
            toast.error(t('categories.actions.edit.error'));
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await remove(deleteModal.id);
            toast.success(t('categories.actions.delete.title'));
        } catch (err) {
            console.error(err);
            toast.error(t('categories.actions.delete.error'));
        }
    };

    const renameName = renameModal.id ? findCategory(tree, renameModal.id)?.name || "" : "";

    return (
        <main className="min-h-[calc(100dvh-80px)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center">
            <CreateCategoryDialog
                open={createModal.open}
                onClose={() => setCreateModal({ open: false, parentId: null })}
                onCreate={handleCreate}
            />
            <EditCategoryDialog
                open={renameModal.open}
                initialName={renameName}
                onClose={() => setRenameModal({ open: false, id: null })}
                onSave={handleRename}
            />
            <ConfirmDeleteCategoryDialog
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, id: null })}
                onConfirm={handleDelete}
            />
            <section className="container mx-auto px-4 py-10 space-y-6">
                <header className="flex items-center justify-between bg-gray-900/70 rounded-2xl px-6 py-4 shadow-lg border border-gray-800">
                    <h1 className="text-xl font-semibold">
                        {t('categories.title')}
                    </h1>
                    <button
                        type="button"
                        onClick={() => setCreateModal({ open: true, parentId: null })}
                        className="btn btn-sm btn-primary rounded-lg"
                    >
                        <Plus size={16} /> {t('categories.new')}
                    </button>
                </header>
                {tree.length ? (
                    <CategoryTree
                        tree={tree}
                        onCreate={parentId => setCreateModal({ open: true, parentId })}
                        onRename={id => setRenameModal({ open: true, id })}
                        onDelete={id => setDeleteModal({ open: true, id })}
                        onReorder={(parent, ids) => reorder(parent, ids)}
                    />
                ) : (
                    <p className="text-center text-gray-400 flex flex-col items-center gap-1">
                        <Sparkles size={18} /> {t('categories.noCats')}
                    </p>
                )}
            </section>
        </main>
    );
}

export default ListCategoryPage;
