import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CheckCircle2, Clock, Database, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { pageVariants, pageTransition } from "../animations/pageVariants";

type PrivacyCard = {
    icon: string;
    title: string;
    description: string;
};

type PrivacySection = {
    title: string;
    description: string;
    items: string[];
};

type PrivacyRights = {
    title: string;
    description: string;
    items: string[];
};

type PrivacyContact = {
    title: string;
    description: string;
    cta: string;
    email: string;
};

const iconMap: Record<string, LucideIcon> = {
    shield: ShieldCheck,
    lock: Lock,
    database: Database,
};

export function PrivacyPolicyPage() {
    const { t } = useTranslation();
    const rawCards = t("privacy.cards", { returnObjects: true });
    const rawSections = t("privacy.sections", { returnObjects: true });
    const rawRights = t("privacy.rights", { returnObjects: true });
    const rawContact = t("privacy.contact", { returnObjects: true });

    const cards = Array.isArray(rawCards) ? (rawCards as PrivacyCard[]) : [];
    const sections = Array.isArray(rawSections) ? (rawSections as PrivacySection[]) : [];
    const rights =
        rawRights && typeof rawRights === "object"
            ? (rawRights as PrivacyRights)
            : { title: "", description: "", items: [] };
    const contact =
        rawContact && typeof rawContact === "object"
            ? (rawContact as PrivacyContact)
            : { title: "", description: "", cta: "", email: "" };

    const rightsItems = Array.isArray(rights.items) ? rights.items : [];

    return (
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative min-h-[calc(100dvh-80px)] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 pb-20 pt-16"
        >
            <div className="absolute inset-0 -z-10">
                <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" aria-hidden />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
            </div>

            <motion.article
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
                className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-200 shadow-2xl backdrop-blur-xl md:p-10"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-8 md:p-10">
                    <div
                        className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-violet-500/25 via-violet-500/10 to-transparent blur-3xl"
                        aria-hidden
                    />
                    <div className="relative space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-violet-200">
                            <Sparkles className="h-4 w-4" aria-hidden />
                            {t("privacy.badge")}
                        </span>
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-slate-50 md:text-4xl">{t("privacy.title")}</h1>
                            <p className="text-base leading-relaxed text-slate-300 md:text-lg">{t("privacy.intro")}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                            <div className="flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1.5">
                                <Clock className="h-4 w-4" aria-hidden />
                                <span>{t("privacy.lastUpdated")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {cards.map((card, idx) => {
                        const Icon = iconMap[card.icon] ?? ShieldCheck;

                        return (
                            <div
                                key={`${card.title}-${idx}`}
                                className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg transition hover:border-violet-400/60 hover:bg-slate-900"
                            >
                                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-400/40">
                                    <Icon className="h-6 w-6" aria-hidden />
                                </span>
                                <h2 className="text-lg font-semibold text-slate-100">{card.title}</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6">
                    {sections.map((section, idx) => (
                        <div
                            key={`${section.title}-${idx}`}
                            className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg md:p-8"
                        >
                            <h3 className="text-xl font-semibold text-slate-100">{section.title}</h3>
                            <p className="mt-2 text-sm text-slate-300">{section.description}</p>
                            <ul className="mt-4 space-y-3">
                                {section.items.map((item, itemIdx) => (
                                    <li key={`${section.title}-${itemIdx}`} className="flex items-start gap-3 text-sm text-slate-200">
                                        <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-violet-300" aria-hidden />
                                        <span className="leading-relaxed text-slate-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                    <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-lg md:p-8">
                        <h3 className="text-xl font-semibold text-slate-100">{rights.title}</h3>
                        <p className="mt-2 text-sm text-slate-300">{rights.description}</p>
                        <ul className="mt-4 space-y-3">
                            {rightsItems.map((item, idx) => (
                                <li key={`right-${idx}`} className="flex items-start gap-3 text-sm text-slate-200">
                                    <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden />
                                    <span className="leading-relaxed text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,255,0.35),transparent_55%)]" aria-hidden />
                        <div className="relative flex h-full flex-col gap-4">
                            <h3 className="text-xl font-semibold">{contact.title}</h3>
                            <p className="text-sm text-slate-200">{contact.description}</p>
                            <a
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                                href={`mailto:${contact.email}`}
                            >
                                {contact.cta}
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                            </a>
                            <div className="mt-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-slate-100">
                                <Mail className="h-4 w-4" aria-hidden />
                                <span>{contact.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.article>
        </motion.section>
    );
}