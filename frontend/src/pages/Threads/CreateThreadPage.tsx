import { useState } from 'react';
import { useThreads } from '../../hooks/useThreads';
import type { Thread } from '../../types/thread';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookmarkPlus, Loader2 } from 'lucide-react';

export function CreateThreadPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { createThread } = useThreads();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        tags: [] as string[],
        tagInput: '',
        is_public: false,
    });
    const [loading, setLoading] = useState(false);

    const addTag = () => {
        const tval = form.tagInput.trim();
        if (!tval || form.tags.includes(tval)) return;
        setForm(prev => ({ ...prev, tags: [...prev.tags, tval], tagInput: '' }));
    };

    const removeTag = (i: number) => {
        setForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        const payload: Omit<Thread, 'id' | 'created_at' | 'updated_at'> = {
            title: form.title.trim(),
            description: form.description.trim() || null,
            tags: form.tags.length ? form.tags : null,
            is_public: form.is_public,
            user_id: user?.id ?? '',
        };
        try {
            setLoading(true);
            const created = await createThread(payload);
            navigate(`/threads/${created.id}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100dvh-80px)] flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white transition-colors">
            <section className="container mx-auto px-4 py-10">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl p-6 border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 shadow-xl">
                    <header className="flex items-center gap-3">
                        <BookmarkPlus className="text-indigo-400" />
                        <h1 className="text-xl font-semibold">{t('threads.create.title')}</h1>
                    </header>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">{t('threads.form.title')}</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder={t('threads.form.placeholders.title') as string}
                            className="input input-bordered rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800/80"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">{t('threads.form.description')}</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={t('threads.form.placeholders.description') as string}
                            className="textarea textarea-bordered rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800/80"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">{t('threads.form.tags')}</label>
                        <div className="flex gap-2 items-center">
                            <input
                                value={form.tagInput}
                                onChange={e => setForm(prev => ({ ...prev, tagInput: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                placeholder={t('threads.form.placeholders.tags') as string}
                                className="input input-bordered rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800/80 flex-1"
                            />
                            <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>{t('threads.form.addTag')}</button>
                        </div>
                        {form.tags.length > 0 && (
                            <ul className="flex gap-2 flex-wrap mt-2">
                                {form.tags.map((tg, i) => (
                                    <li key={`${tg}-${i}`} className="text-xs bg-indigo-100/60 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-xl flex items-center gap-1">
                                        {tg}
                                        <button type="button" className="text-[10px] opacity-70 hover:opacity-100" onClick={() => removeTag(i)}>×</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="is_public" type="checkbox" checked={form.is_public} onChange={e => setForm(prev => ({ ...prev, is_public: e.target.checked }))} />
                        <label htmlFor="is_public" className="text-sm">{t('threads.form.public')}</label>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary rounded-xl px-4 py-2" disabled={loading}>
                            {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> {t('threads.create.creating')}</span> : t('threads.create.create')}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default CreateThreadPage;

