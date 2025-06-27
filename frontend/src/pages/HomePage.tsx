import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Sparkles, Code } from "lucide-react";
import { Button } from "../components/ui/button";

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
    return (
        <motion.main
            initial="hidden"
            animate="show"
            variants={container}
            className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 overflow-x-hidden py-16 px-4"
        >
            <section className="max-w-4xl w-full text-center space-y-6">
                <motion.h1
                    variants={child}
                    className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-500 drop-shadow-sm"
                >
                    Organiza tus enlaces <br className="hidden md:block" /> en un solo lugar
                </motion.h1>

                <motion.p
                    variants={child}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                >
                    LinkNest te ayuda a guardar, clasificar y redescubrir cualquier enlace,
                    desde artículos de referencia hasta vídeos inspiradores, con un solo clic.
                </motion.p>

                <motion.div variants={child} className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <Button
                        asChild
                        className="group relative inline-flex items-center gap-2 text-base font-semibold px-8 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-lime-400/80 transition"
                    >
                        <Link to="/login" className="flex items-center gap-2">
                            Empieza ahora
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
                            Código fuente
                            <Code size={18} className="transition-transform group-hover:-rotate-6" />
                        </a>
                    </Button>
                </motion.div>
            </section>

            <motion.section
                variants={container}
                className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl"
            >
                {[
                    {
                        icon: <Bookmark className="w-6 h-6 text-indigo-400" />,
                        title: "Guarda al instante",
                        description: "Añade enlaces con un solo clic y nosotros capturamos título, favicon y meta descriptiva por ti.",
                    },
                    {
                        icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />,
                        title: "Clasifica y encuentra",
                        description: "Etiqueta tus enlaces, crea categorías y filtra por favoritos para encontrar lo que buscas en segundos.",
                    },
                    {
                        icon: <ArrowRight className="w-6 h-6 text-gray-300" />,
                        title: "Comparte con quien quieras",
                        description: "Genera colecciones públicas o privadas para compartir tus mejores recursos con tu equipo o amigos.",
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

            <motion.footer variants={child} className="text-sm text-gray-500 mt-24">
                Hecho con ❤️ y ☕️ — © {new Date().getFullYear()} LinkNest
            </motion.footer>
        </motion.main>
    );
}
