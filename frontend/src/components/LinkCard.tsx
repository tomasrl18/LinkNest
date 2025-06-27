import type { Link } from "../types/link";
import { useMemo } from "react";

const gradientColors = [
    "from-red-600 via-red-500 to-red-700",
    "from-orange-600 via-orange-500 to-orange-700",
    "from-amber-600 via-amber-500 to-amber-700",
    "from-yellow-600 via-yellow-500 to-yellow-700",
    "from-lime-600 via-lime-500 to-lime-700",
    "from-green-600 via-green-500 to-green-700",
    "from-emerald-600 via-emerald-500 to-emerald-700",
    "from-teal-600 via-teal-500 to-teal-700",
    "from-cyan-600 via-cyan-500 to-cyan-700",
    "from-sky-600 via-sky-500 to-sky-700",
    "from-blue-600 via-blue-500 to-blue-700",
    "from-indigo-600 via-indigo-500 to-indigo-700",
    "from-violet-600 via-violet-500 to-violet-700",
    "from-purple-600 via-purple-500 to-purple-700",
    "from-fuchsia-600 via-fuchsia-500 to-fuchsia-700",
    "from-pink-600 via-pink-500 to-pink-700",
    "from-rose-600 via-rose-500 to-rose-700",
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