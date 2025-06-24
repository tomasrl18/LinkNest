import type { Link } from "../types/link";


function LinkCard({ link }: { link: Link }) {
    return (
        <article className="flex items-start gap-3 p-4 border rounded-xl shadow-sm">
            <img src={`https://www.google.com/s2/favicons?domain=${link.url}`} className="w-5 h-5 mt-1" />
            <div className="flex-1">
                <a href={link.url} target="_blank" rel="noreferrer" className="font-semibold">{link.title}</a>
                <p className="text-sm text-gray-500">{link.description}</p>
                {link.tags?.length && (
                    <ul className="flex gap-1 mt-1 flex-wrap">
                        {link.tags.map(t => <li key={t} className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">{t}</li>)}
                    </ul>
                )}
            </div>
            {/* <button onClick={() => toggleFav(link.id)}>★</button> */}
        </article>
    );
}

export default LinkCard;