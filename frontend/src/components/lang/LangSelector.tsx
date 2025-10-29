import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Lng = "es" | "en";

const LANGS: Record<Lng, { label: string; code: string }> = {
    es: { label: "Español", code: "es" },
    en: { label: "English", code: "gb" },
};

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const current = (i18n.resolvedLanguage as Lng) || "es";

    const change = async (lng: Lng) => {
        await i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-300 hover:text-white cursor-pointer"
                    aria-label={t('langSelector.ariaLabelButton')}
                >
                    <span className="inline-flex items-center gap-1">
                        <span className={`fi fi-${LANGS[current].code} rounded-[2px]`} />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-30">
                <DropdownMenuLabel>
                    {t("langSelector.titleItems")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(LANGS) as Lng[]).map((lng) => (
                    <DropdownMenuItem
                        key={lng}
                        onClick={() => change(lng)}
                        className="justify-center cursor-pointer"
                        aria-label={`Cambiar a ${LANGS[lng].label}`}
                    >
                        <span className={`fi fi-${LANGS[lng].code} rounded-[2px]`} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
  );
}
