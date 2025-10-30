import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useThread } from '../../hooks/useThread';
import ThreadTimeline from '../../components/threads/ThreadTimeline';
import { useLinks } from '../../hooks/useLinks';
import { Clock, Layers, Plus, Trash } from 'lucide-react';
import LinkCard from '../../components/links/LinkCard';

import { useTranslation } from 'react-i18next';

import ConfirmRemoveThreadLinkDialog from '../../components/threads/ConfirmRemoveThreadLinkDialog';

export function ViewThreadPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { thread, addLink, fetchThread, removeLink } = useThread(id ?? null);
    const { links } = useLinks();
    const [mode, setMode] = useState<'timeline' | 'stack'>('timeline');
    const [selectedLinkId, setSelectedLinkId] = useState('');

    const items = useMemo(() => thread?.thread_links ?? [], [thread]);

    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingLinkId, setPendingLinkId] = useState<string | null>(null);
    const openRemoveDialog = (linkId: string) => {
        setPendingLinkId(linkId);
        setConfirmOpen(true);
    };

    const handleAdd = async () => {
        if (!selectedLinkId) return;
        const nextPos = (items?.length ?? 0) + 1;
        await addLink(selectedLinkId, nextPos, null);
        setSelectedLinkId('');
        await fetchThread();
    };

    return (
        <main className="min-h-[calc(100dvh-80px)] flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white transition-colors">
            <section className="container mx-auto px-4 py-10 space-y-6">
                {thread && (
                    <header className="rounded-2xl px-6 py-5 shadow-lg border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 transition-colors text-center">
                        <h1 className="text-2xl font-bold">{thread.title}</h1>
                        {thread.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{thread.description}</p>
                        )}
                        {Array.isArray(thread.tags) && thread.tags.length > 0 && (
                            <ul className="flex gap-2 flex-wrap mt-2">
                                {thread.tags.map((tg, i) => (
                                    <li key={`${tg}-${i}`} className="text-sm font-bold bg-indigo-100/60 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-xl">
                                        {tg}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex items-center gap-2 rounded-xl px-3 py-1 bg-gray-100 dark:bg-gray-800/70 transition-colors">
                                <select
                                    value={selectedLinkId}
                                    onChange={e => setSelectedLinkId(e.target.value)}
                                    className="rounded-lg px-2 py-1 text-sm bg-transparent outline-none"
                                >
                                    <option value="">{t('threads.add.select')}</option>
                                    {links.map(l => (
                                        <option key={l.id} value={l.id} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200">{l.title ?? l.url}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={handleAdd} className="btn btn-sm btn-primary rounded-lg px-3 flex items-center gap-1">
                                    <Plus size={14} /> {t('threads.add.add')}
                                </button>
                            </div>
                            <div className="ml-auto flex items-center gap-2 rounded-xl px-2 py-1 bg-gray-100 dark:bg-gray-800/70">
                                <button
                                    type="button"
                                    className={`px-3 py-1 rounded-lg text-sm inline-flex items-center gap-1 ${mode === 'timeline' ? 'bg-indigo-500 text-white' : ''}`}
                                    onClick={() => setMode('timeline')}
                                >
                                    <Clock size={14} /> {t('threads.view.timeline')}
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1 rounded-lg text-sm inline-flex items-center gap-1 ${mode === 'stack' ? 'bg-indigo-500 text-white' : ''}`}
                                    onClick={() => setMode('stack')}
                                >
                                    <Layers size={14} /> {t('threads.view.stacked')}
                                </button>
                            </div>
                        </div>
                    </header>
                )}

                <section className="space-y-4">
                    {mode === 'timeline' && (
                        <ThreadTimeline items={items.filter(i => i.links)} onRemove={openRemoveDialog} />
                    )}
                    {mode === 'stack' && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.filter(i => i.links).map(item => (
                                <li key={item.id} className="rounded-xl border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800">
                                    {item.links && (
                                        <div className="relative pb-14">
                                            <button type="button" aria-label="Remove link from thread" title="Quitar" onClick={() => openRemoveDialog(item.link_id)} className="cursor-pointer absolute bottom-2 right-2 w-11 h-11 flex items-center justify-center rounded-full bg-red-100/80 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                                                <Trash size={18} />
                                            </button>
                                            <LinkCard link={item.links} />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
            <ConfirmRemoveThreadLinkDialog
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    if (pendingLinkId) {
                        await removeLink(pendingLinkId);
                    }
                    setConfirmOpen(false);
                    setPendingLinkId(null);
                }}
            />
        </main>
    );
}

export default ViewThreadPage;




















