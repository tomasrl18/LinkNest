import type { Thread } from '../../types/thread';
import { Link } from 'react-router-dom';

export function ThreadCard({ thread }: { thread: Thread }) {
    return (
        <Link to={`/threads/${thread.id}`}>
            <li className="rounded-2xl border bg-white/90 border-gray-200 dark:bg-gray-900/70 dark:border-gray-800 shadow-sm p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {thread.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                        {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                </div>
                {thread.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{thread.description}</p>
                )}
                {Array.isArray(thread.tags) && thread.tags?.length > 0 && (
                    <ul className="flex gap-1 mt-1 flex-wrap">
                        {thread.tags.map((t, i) => (
                            <li key={`${t}-${i}`} className="text-xs bg-indigo-100/60 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-xl">
                                {t}
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        </Link>
    );
}

export default ThreadCard;

