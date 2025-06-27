import type { Link } from "../types/link";

function LinkCard({ link }: { link: Link }) {
    return (
        <article className="flex items-start gap-3 p-4 rounded-xl shadow-sm">
            <img src={`https://www.google.com/s2/favicons?domain=${link.url}`} className="w-5 h-5 mt-1" />
            <div className="flex-1">
                <a href={link.url} target="_blank" rel="noreferrer" className="font-semibold">{link.title ? link.title : link.url}</a>
                <p className="text-sm text-gray-500">{link.description}</p>
                {Array.isArray(link.tags) && link.tags.length > 0 && (
                    <ul className="flex gap-1 mt-1 flex-wrap">
                        {
                            link.tags.map(t => <li
                                    key={t}
                                    className="text-xs bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 px-1.5 py-0.5 rounded-xl font-bold"
                                >
                                    {t}
                                </li>
                            )
                        }
                    </ul>
                )}
            </div>
        </article>
    );
}

export default LinkCard;