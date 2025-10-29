import { useMemo, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { useCategoryTree } from "../../hooks/useCategoryTree";
import { useAuth } from "../../context/AuthProvider";
import { CreateCategoryDialog } from "../../components/categories/CreateCategoryDialog";
import { EditCategoryDialog } from "../../components/categories/EditCategoryDialog";
import ConfirmDeleteCategoryDialog from "../../components/categories/ConfirmDeleteCategoryDialog";
import { ShareCategoryDialog } from "../../components/categories/ShareCategoryDialog";
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

function filterTree(nodes: CategoryNode[], query: string): CategoryNode[] {
    if (!query) return nodes;
    const q = query.toLowerCase();
    return nodes
        .map(n => ({ ...n, children: filterTree(n.children, query) }))
        .filter(n => n.name.toLowerCase().includes(q) || n.children.length);
}

export function ListCategoryPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { tree, create, rename, remove, reorder } = useCategoryTree();
    const [search, setSearch] = useState("");
    const [createModal, setCreateModal] = useState<{ open: boolean; parentId: string | null }>({ open: false, parentId: null });
    const [renameModal, setRenameModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [shareModal, setShareModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

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

    const filtered = useMemo(() => filterTree(tree, search), [tree, search]);

    return (
        <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white transition-colors">
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
            <ShareCategoryDialog
                open={shareModal.open}
                categoryId={shareModal.id || ""}
                onClose={() => setShareModal({ open: false, id: null })}
            />
            <section className="container mx-auto px-4 py-10 space-y-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center w-full rounded-2xl px-6 py-4 shadow-lg border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 transition-colors">
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <h1 className="text-xl font-semibold">{t('categories.title')}</h1>
                        <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-800/70 transition-colors">
                            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <input
                                placeholder={t('categories.search')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCreateModal({ open: true, parentId: null })}
                        className="flex items-center gap-2 rounded-xl px-3 py-1 cursor-pointer select-none transition-colors border focus:outline-none mt-4 sm:mt-0 bg-gray-100 border-gray-200 hover:border-indigo-400 dark:bg-gray-800/70 dark:border-transparent"
                    >
                        <Plus size={16} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{t('categories.new')}</span>
                    </button>
                </header>
                {filtered.length ? (
                    <div className="rounded-2xl px-6 py-4 shadow-lg border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 transition-colors">
                        <CategoryTree
                            tree={filtered}
                            onCreate={parentId => setCreateModal({ open: true, parentId })}
                            onRename={id => setRenameModal({ open: true, id })}
                            onDelete={id => setDeleteModal({ open: true, id })}
                            onShare={id => setShareModal({ open: true, id })}
                            onReorder={(parent, ids) => reorder(parent, ids)}
                        />
                    </div>
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 flex flex-col items-center gap-1">
                        <Sparkles size={18} /> {t('categories.noCats')}
                    </p>
                )}
            </section>
        </main>
    );
}

export default ListCategoryPage;
