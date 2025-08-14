import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Sparkles, Code, Share2, Puzzle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTranslation, Trans } from "react-i18next";
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

    return (
        <motion.main
            initial="hidden"
            animate="show"
            variants={container}
            className="min-h-[calc(100dvh-80px)] flex flex-col items-center justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 overflow-x-hidden py-16 px-4"
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
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
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
            </section>

            <motion.section
                variants={container}
                className="grid md:grid-cols-3 gap-6 mt-24 w-full container mx-auto"
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
                        icon: <Share2 className="w-6 h-6 text-gray-300" />,
                        title: t('home.infoSection.share.title'),
                        description: t('home.infoSection.share.subtitle'),
                    },
                ].map(({ icon, title, description }) => (
                    <motion.article
                        key={title}
                        variants={child}
                        className="rounded-2xl bg-gray-900/80 backdrop-blur border border-gray-800 p-6 shadow-lg hover:scale-[1.02] transition-transform"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/40 rounded-full mb-4">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-gray-100">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </motion.article>
                ))}
            </motion.section>

            <motion.section variants={container} className="mt-24 w-full container mx-auto">
                <motion.div
                    variants={child}
                    className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 shadow-lg"
                >
                    <div className="flex items-center gap-4 p-6 bg-gray-900/90 rounded-2xl justify-center">
                        <Puzzle className="w-10 h-10 text-indigo-300" />
                        <p className="text-lg text-gray-100 text-left">
                            {t('home.infoSection.extensionSoon.title')}
                        </p>
                    </div>
                </motion.div>
            </motion.section>

            <motion.section
                variants={container}
                className="mt-24 w-full container mx-auto text-center bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-transform"
            >
                <motion.h2
                    variants={child}
                    className="text-2xl font-bold text-gray-100 mb-2"
                >
                    {t('home.suggestions')}
                </motion.h2>
                <motion.p variants={child} className="text-gray-400">
                    {t('home.mail.mailTo')}{' '}
                    <a
                        href="mailto:mailslinknest@gmail.com"
                        className="text-indigo-300 hover:underline"
                    >
                        mailslinknest@gmail.com
                    </a>
                </motion.p>
            </motion.section>
        </motion.main>
    );
}
