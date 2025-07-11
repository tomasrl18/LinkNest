import type { Link } from "../../types/link";
import { useMemo } from "react";
import { gradientColors } from "../../constants/gradientColors";
import SocialIcon from "./SocialIcon";

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
            <SocialIcon url={link.url} />
            <div className="flex-1">
                <a href={link.url} target="_blank" rel="noreferrer" className="font-semibold">
                    {link.title ? link.title : link.url}
                </a>
                <p className="text-sm text-gray-500">{link.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                    Categoría: {link.category?.name || link.categories?.name || 'Sin categoría'}
                </p>
                {Array.isArray(link.tags) && link.tags.length > 0 && (
                    <ul className="flex gap-1 mt-2 flex-wrap">
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