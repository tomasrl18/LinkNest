import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Loader2, Plus, Link as LinkIcon, Tag, X } from "lucide-react";
import { useLinks } from "../../hooks/useLinks";
import { useCategories } from "../../hooks/useCategories";
import { CreateCategoryDialog } from "../../components/categories/CreateCategoryDialog";
import type { Link } from "../../types/link";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function EditLinkPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { links, updateLink, fetchLinks } = useLinks();
    const { categories, createCategory, fetchCategories } = useCategories();

    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        category_id: "",
        tags: [] as string[],
        favorite: false,
    });
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        const link = links.find(l => l.id === id);
        if (link) {
            setForm({
                url: link.url,
                title: link.title ?? "",
                description: link.description ?? "",
                category_id: link.category_id ?? "",
                tags: Array.isArray(link.tags) ? link.tags : [],
                favorite: link.favorite,
            });
        } else {
            fetchLinks();
        }
    }, [id, links, fetchLinks]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value, checked } = e.target as HTMLInputElement;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const addTag = () => {
        const newTag = tagInput.trim();
        if (!newTag) return;
        if (form.tags.includes(newTag)) {
            setTagInput("");
            return;
        }
        setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput("");
    };

    const removeTag = (index: number) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !form.url.trim()) return;

        const payload: Partial<Link> = {
            url: form.url.trim(),
            title: form.title.trim() || null,
            description: form.description.trim() || null,
            category_id: form.category_id.trim() || null,
            tags: form.tags.length > 0 ? form.tags : null,
            favorite: form.favorite,
            user_id: user?.id ?? "",
        };

        try {
            setLoading(true);
            await updateLink(id, payload);
            toast.success(t('links.edit.successEditLink'));
            navigate("/links");
        } catch (err) {
            console.error(err);
            toast.error(t('links.edit.errorEditLink'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100dvh-80px)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center relative overflow-hidden">
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
            <section className="container mx-auto px-4 py-10 z-10">
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
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                            {t('links.edit.title')}
                        </h1>
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
                                className="input input-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80 focus:ring-2 focus:ring-pink-500 outline-none"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="title" className="text-sm font-medium pl-1">
                                    {t('links.formFields.title')}
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="input input-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <label htmlFor="category_id" className="text-sm font-medium pl-1">
                                    {t('links.formFields.category')}
                                </label>
                                <div className="flex gap-2 items-center">
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                                        className="select select-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80"
                                    >
                                        <option value="">
                                            {t('links.formFields.noCat')}
                                        </option>
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
                            <label htmlFor="description" className="text-sm font-medium pl-1">
                                {t('links.formFields.description')}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                maxLength={240}
                                value={form.description}
                                onChange={handleChange}
                                className="textarea textarea-bordered w-full rounded-xl px-3 py-2 text-sm bg-gray-800/80 resize-none"
                            />
                            <span className="text-xs text-gray-500 text-right">{form.description.length}/240</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                            <div className="flex-1 flex flex-col gap-1 relative">
                                <label htmlFor="tagInput" className="text-sm font-medium pl-1">
                                    {t('links.formFields.tags')}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="tagInput"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                        placeholder={t('links.formFields.placeholders.tags')}
                                        className="input input-bordered w-full rounded-xl px-2 py-2 text-sm bg-gray-800/80"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="btn btn-square btn-outline btn-primary rounded-lg min-h-0 h-10 w-10"
                                    >
                                        <Tag size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1 min-h-[24px]">
                                    {form.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="badge badge-sm badge-info bg-gradient-to-r from-indigo-400 to-pink-400 text-white border-0 opacity-80 pl-3 pr-1 flex items-center gap-1"
                                        >
                                            {tag}
                                            <button type="button" onClick={() => removeTag(i)} className="ml-1 focus:outline-none">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    aria-pressed={form.favorite}
                                    onClick={() => setForm(prev => ({ ...prev, favorite: !prev.favorite }))}
                                    className={`cursor-pointer mx-auto mt-4 sm:mt-1 transition-all duration-200 rounded-full p-2 sm:p-2.5 border-2 focus:outline-none focus:ring-2 focus:ring-pink-400/60 shadow-sm z-10
                                        ${form.favorite ? 'bg-pink-500/90 border-pink-400 text-white scale-110' : 'bg-gray-800/80 border-gray-600 text-pink-300 hover:bg-pink-400/20'}`}
                                    style={{ boxShadow: '0 2px 8px 0 #0002' }}
                                >
                                    <motion.span
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: form.favorite ? 1.2 : 1, rotate: form.favorite ? 18 : 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                        className="flex items-center justify-center"
                                    >
                                        {form.favorite ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
                                                <path d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.873 6.9-1.002L12 2.5l3.093 5.747 6.9 1.002-5 4.873 1.179 6.873z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.873 6.9-1.002L12 2.5l3.093 5.747 6.9 1.002-5 4.873 1.179 6.873z" />
                                            </svg>
                                        )}
                                    </motion.span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="cursor-pointer w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-pink-500 to-fuchsia-500 hover:from-indigo-700 hover:to-fuchsia-600 py-3 text-base font-semibold shadow-lg transition-all duration-200 disabled:opacity-60 mt-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        <span>
                            {t('links.formFields.saveChanges')}
                        </span>
                    </motion.button>
                </motion.form>
            </section>
        </main>
    );
}

export default EditLinkPage;
