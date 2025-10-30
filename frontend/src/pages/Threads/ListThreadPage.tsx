import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useThreads } from '../../hooks/useThreads';
import ThreadCard from '../../components/threads/ThreadCard';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ListThreadPage() {
    const { t } = useTranslation();
    const { threads } = useThreads();
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return threads.filter(th => !q || th.title.toLowerCase().includes(q) || (th.description ?? '').toLowerCase().includes(q));
    }, [threads, search]);

    return (
        <main className="min-h-[calc(100dvh-80px)] flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white transition-colors">
            <section className="container mx-auto px-4 py-10 space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-end w-full rounded-2xl px-6 py-4 shadow-lg border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 mb-4 transition-colors gap-3">
                    <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-800/70 transition-colors">
                        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <input
                            placeholder={t('threads.search') as string}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none placeholder:text-gray-500 text-sm text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Link to="/threads/new" className="btn btn-primary rounded-xl px-4 py-2 flex items-center gap-2">
                            <Plus size={16} /> {t('threads.create.new')}
                        </Link>
                    </div>
                </header>

                {filtered.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(th => (
                            <ThreadCard key={th.id} thread={th} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">{t('threads.empty')}</p>
                )}
            </section>
        </main>
    );
}

export default ListThreadPage;

