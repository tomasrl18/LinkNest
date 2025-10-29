import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Sparkles, Code, Share2, Puzzle, Upload, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTranslation, Trans } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";
import type { Variants } from "framer-motion";

const container: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.2,
        },
    },
};

const child: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, damping: 18, stiffness: 120 },
    },
};

export function HomePage() {
    const { t } = useTranslation();
    const { isInstallable, promptInstall, requiresManualInstall } = usePwaInstall();
    const [showInstallHelp, setShowInstallHelp] = useState(false);

    const iosInstallSteps = useMemo(() => {
        if (!showInstallHelp) return [] as string[];
        return t("pwa.manualInstallSteps", { returnObjects: true }) as string[];
    }, [showInstallHelp, t]);

    const handleInstallClick = useCallback(async () => {
        const outcome = await promptInstall();
        if (outcome === "manual") {
            setShowInstallHelp(true);
        }
        return outcome;
    }, [promptInstall]);

    return (
        <motion.main
            initial="hidden"
            animate="show"
            variants={container}
            className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-between overflow-x-hidden py-16 px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-colors"
        >
            <section className="container mx-auto text-center space-y-6">
                <motion.h1
                    variants={child}
                    className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500 drop-shadow-sm"
                >
                    <Trans i18nKey="home.title">
                        Organiza tus enlaces <br className="hidden md:block" /> en un solo lugar
                    </Trans>
                </motion.h1>

                <motion.p
                    variants={child}
                    className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto transition-colors"
                >
                    {t('home.subtitle')}
                </motion.p>

                <motion.div variants={child} className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <Button
                        asChild
                        className="group relative inline-flex items-center gap-2 text-base font-semibold px-8 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-lime-400/80 transition"
                    >
                        <Link to="/register" className="flex items-center gap-2">
                            {t('home.startNow')}
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="secondary"
                        className="group relative inline-flex items-center gap-2 text-base px-8 py-3 rounded-2xl border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-100 transition"
                    >
                        <a
                            href="https://github.com/tomasrl18/LinkNest"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2"
                        >
                            {t('home.code')}
                            <Code size={18} className="transition-transform group-hover:-rotate-6" />
                        </a>
                    </Button>
                </motion.div>

                <motion.div variants={child} className="max-w-3xl mx-auto w-full mt-10">
                    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 shadow-xl">
                        <div className="flex flex-col gap-4 rounded-2xl bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-900/95 transition-colors">
                            <div className="flex items-start gap-4 text-left">
                                <div className="rounded-full bg-sky-500/15 p-3 text-sky-700 dark:text-sky-300">
                                    <Download className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                                        {t("home.pwaAnnouncement.title")}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                                        {t("home.pwaAnnouncement.description")}
                                    </p>
                                    {showInstallHelp && iosInstallSteps.length > 0 && (
                                        <div className="space-y-2 text-sm">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {t("pwa.manualInstallTitle")}
                                            </p>
                                            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 transition-colors">
                                                {iosInstallSteps.map((step, index) => (
                                                    <li key={`ios-install-${index}`}>{step}</li>
                                                ))}
                                            </ol>
                                            <Button
                                                variant="ghost"
                                                className="px-0 text-indigo-300 hover:text-indigo-100"
                                                onClick={() => setShowInstallHelp(false)}
                                            >
                                                {t("pwa.manualInstallDismiss")}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isInstallable ? (
                                <Button
                                    className="shrink-0 bg-sky-600 text-white shadow hover:bg-sky-500"
                                    onClick={() => void handleInstallClick()}
                                    aria-label={
                                        requiresManualInstall ? t("pwa.manualInstallTitle") : t("home.pwaAnnouncement.cta")
                                    }
                                >
                                    {requiresManualInstall ? t("pwa.manualInstallTitle") : t("home.pwaAnnouncement.cta")}
                                </Button>
                            ) : (
                                <span className="text-sm font-medium text-sky-200">
                                    {t("home.pwaAnnouncement.available")}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            <motion.section
                variants={container}
                className="grid md:grid-cols-2 gap-6 mt-24 w-full container mx-auto justify-center"
            >
                {[
                    {
                        icon: <Bookmark className="w-6 h-6 text-indigo-400" />,
                        title: t('home.infoSection.instantlySave.title'),
                        description: t('home.infoSection.instantlySave.subtitle'),
                    },
                    {
                        icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />,
                        title: t('home.infoSection.sortFind.title'),
                        description: t('home.infoSection.sortFind.subtitle'),
                    },
                    {
                        icon: <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />, 
                        title: t('home.infoSection.share.title'),
                        description: t('home.infoSection.share.subtitle'),
                    },
                    {
                        icon: <Upload className="w-6 h-6 text-gray-600 dark:text-gray-300" />, 
                        title: t('home.infoSection.importBookmarks.title'),
                        description: t('home.infoSection.importBookmarks.subtitle'),
                    },
                ].map(({ icon, title, description }) => (
                    <motion.article
                        key={title}
                        variants={child}
                        className="rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-6 shadow-lg hover:scale-[1.02] transition-transform dark:bg-gray-900/80 dark:border-gray-800"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/40 rounded-full mb-4">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
                    </motion.article>
                ))}
            </motion.section>

            <motion.section variants={container} className="mt-24 w-full container mx-auto">
                <motion.div
                    variants={child}
                    className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 shadow-lg"
                >
                    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl justify-center dark:bg-gray-900/90 transition-colors">
                        <Puzzle className="w-10 h-10 text-indigo-300" />
                        <p className="text-lg text-gray-900 dark:text-gray-100 text-left">
                            {t('home.infoSection.extensionAvailable.title')}&nbsp;
                            <a
                                href="https://chromewebstore.google.com/detail/linknest-%E2%80%93-save-to-linkne/inhbpecnljglajkelbkgipjnokmmnkgc?hl=es"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-700 hover:underline dark:text-indigo-300"
                            >
                                {t('home.infoSection.extensionAvailable.cta')}
                            </a>
                        </p>
                    </div>
                </motion.div>
            </motion.section>

            <motion.section
                variants={container}
                className="mt-20 w-full container mx-auto text-center bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform dark:bg-gray-900/80 dark:border-gray-800"
            >
                <motion.h2
                    variants={child}
                    className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                >
                    {t('home.suggestions')}
                </motion.h2>
                <motion.p variants={child} className="text-gray-600 dark:text-gray-400">
                    {t('home.mail.mailTo')}{' '}
                    <a
                        href="mailto:mailslinknest@gmail.com"
                        className="text-indigo-700 dark:text-indigo-300 hover:underline"
                    >
                        mailslinknest@gmail.com
                    </a>
                </motion.p>
            </motion.section>
        </motion.main>
    );
}
