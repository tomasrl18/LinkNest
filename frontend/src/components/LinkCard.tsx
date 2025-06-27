import type { Link } from "../types/link";
import { useMemo } from "react";

const gradientColors = [
    "from-red-700 via-red-400 to-red-800",
    "from-orange-700 via-orange-400 to-orange-800",
    "from-amber-700 via-amber-400 to-amber-800",
    "from-yellow-700 via-yellow-400 to-yellow-800",
    "from-lime-700 via-lime-400 to-lime-800",
    "from-green-700 via-green-400 to-green-800",
    "from-emerald-700 via-emerald-400 to-emerald-800",
    "from-teal-700 via-teal-400 to-teal-800",
    "from-cyan-700 via-cyan-400 to-cyan-800",
    "from-sky-700 via-sky-400 to-sky-800",
    "from-blue-700 via-blue-400 to-blue-800",
    "from-indigo-700 via-indigo-400 to-indigo-800",
    "from-violet-700 via-violet-400 to-violet-800",
    "from-purple-700 via-purple-400 to-purple-800",
    "from-fuchsia-700 via-fuchsia-400 to-fuchsia-800",
    "from-pink-700 via-pink-400 to-pink-800",
    "from-rose-700 via-rose-400 to-rose-800",
];

function getRandomGradient() {
    return gradientColors[Math.floor(Math.random() * gradientColors.length)];
}

function LinkCard({ link }: { link: Link }) {
    const tagGradients = useMemo(
        () => (Array.isArray(link.tags) ? link.tags.map(() => getRandomGradient()) : []),
        [link.tags]
    );
    return (
        <article className="flex items-start gap-3 p-4 rounded-xl shadow-sm">
            <img src={`https://www.google.com/s2/favicons?domain=${link.url}`} className="w-5 h-5 mt-1" />
            <div className="flex-1">
                <a href={link.url} target="_blank" rel="noreferrer" className="font-semibold">{link.title ? link.title : link.url}</a>
                <p className="text-sm text-gray-500">{link.description}</p>
                {Array.isArray(link.tags) && link.tags.length > 0 && (
                    <ul className="flex gap-1 mt-1 flex-wrap">
                        {link.tags.map((t, i) => (
                            <li
                                key={t}
                                className={`text-xs bg-gradient-to-br ${tagGradients[i]} px-1.5 py-0.5 rounded-xl font-bold`}
                            >
                                {t}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </article>
    );
}

export default LinkCard;