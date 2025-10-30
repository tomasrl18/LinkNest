import type { ThreadLink } from '../../types/thread';
import LinkCard from '../links/LinkCard';

export function ThreadTimeline({ items }: { items: ThreadLink[] }) {
    const sorted = [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return (
        <ol className="relative border-s border-gray-200 dark:border-gray-700 pl-6 space-y-6">
            {sorted.map(item => (
                <li key={item.id} className="ms-4">
                    <div className="absolute w-3 h-3 bg-indigo-400 rounded-full mt-2 -start-1.5 border border-white dark:border-gray-900" />
                    {item.links && (
                        <div className="rounded-xl bg-white/90 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800">
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

