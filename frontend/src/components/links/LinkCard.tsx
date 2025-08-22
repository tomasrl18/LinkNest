import type { Link } from "../../types/link";
import { useMemo } from "react";
import { gradientColors } from "../../constants/gradientColors";
import SocialIcon from "./SocialIcon";
import { useTranslation } from "react-i18next";
import { trackOpen } from "../../lib/analytics.service";

type LinkInput = Pick<Link, "id" | "url"> & Partial<Link>;

function getRandomGradient() {
    return gradientColors[Math.floor(Math.random() * gradientColors.length)];
}

function LinkCard({ link, onOpen }: { link: LinkInput; onOpen?: () => void }) {
    const { t } = useTranslation();

    const title = link.title ?? link.url ?? "";
    const description = link.description ?? "";
    const categoryName = link.category?.name || link.categories?.name || t?.("links.formFields.noCat") || "Sin categoría";
    const tags = useMemo(() => Array.isArray(link.tags) ? link.tags : [], [link.tags]);

    const tagGradients = useMemo(
        () => tags.map(() => getRandomGradient()),
        [tags]
    );

    return (
        <article className="flex items-start gap-3 p-4 rounded-xl shadow-sm">
            <SocialIcon url={link.url} />
            <div className="flex-1">
                <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold"
                    onClick={() => {
                        trackOpen(link.id).catch(console.error);
                        onOpen?.();
                    }}
                >
                    {title}
                </a>
                {description && <p className="text-sm text-gray-500">{description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                    {t("links.linkCard.titleCat")}: {categoryName}
                </p>
                {tags.length > 0 && (
                    <ul className="flex gap-1 mt-2 flex-wrap">
                        {tags.map((t, i) => (
                            <li
                                key={`${t}-${i}`}
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