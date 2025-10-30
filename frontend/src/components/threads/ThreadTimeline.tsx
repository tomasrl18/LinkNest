import type { ThreadLink } from '../../types/thread';
import LinkCard from '../links/LinkCard';
import { Trash } from 'lucide-react';

export function ThreadTimeline({ items, onRemove }: { items: ThreadLink[]; onRemove?: (linkId: string) => void | Promise<void> }) {
    const sorted = [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return (
        <ol className="relative border-s border-gray-200 dark:border-gray-700 pl-6 space-y-6">
            {sorted.map(item => (
                <li key={item.id} className="ms-4">
                    <div className="absolute w-3 h-3 bg-indigo-400 rounded-full mt-2 -start-1.5 border border-white dark:border-gray-900" />
                    {item.links && (
                        <div className="relative rounded-xl bg-white/90 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 pb-14">
                            {onRemove && (<button type="button" aria-label="Remove link from thread" title="Quitar" onClick={() => onRemove(item.link_id)} className="cursor-pointer absolute bottom-2 right-2 w-11 h-11 flex items-center justify-center rounded-full bg-red-100/80 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                                <Trash size={18} />
                            </button>)}
                            <LinkCard link={item.links} />
                        </div>
                    )}
                    {item.note && (
                        <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                    )}
                </li>
            ))}
        </ol>
    );
}

export default ThreadTimeline;










