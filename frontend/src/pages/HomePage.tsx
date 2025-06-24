/* eslint-disable no-irregular-whitespace */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Sparkles } from "lucide-react";
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
            className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-indigo-50 via-sky-50 to-white overflow-x-hidden py-16 px-4"
        >
            <section className="max-w-4xl w-full text-center space-y-6">
                <motion.h1
                    variants={child}
                    className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600 drop-shadow-sm"
                >
                    Organiza tus enlaces <br className="hidden md:block" /> en un solo lugar.
                </motion.h1>

                <motion.p
                    variants={child}
                    className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
                >
                    Link&nbsp;Nest te ayuda a guardar, clasificar y redescubrir cualquier enlace,
                    desde artículos de referencia hasta vídeos inspiradores, con un solo clic.
                </motion.p>

                <motion.div variants={child} className="flex justify-center gap-4">
                    <Button asChild className="text-base px-6 py-3 rounded-2xl shadow-xl">
                        <Link to="/login" className="flex items-center gap-2">
                            Empieza ahora <ArrowRight size={18} />
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild className="text-base px-6 py-3 rounded-2xl">
                        <a href="https://github.com/tu-repo" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                            Código fuente <Sparkles size={18} />
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
                        icon: <Bookmark className="w-6 h-6" />,
                        title: "Guarda al instante",
                        description: "Añade enlaces con un solo clic y nosotros capturamos título, favicon y meta descriptiva por ti.",
                    },
                    {
                        icon: <Sparkles className="w-6 h-6" />,
                        title: "Clasifica y encuentra",
                        description: "Etiqueta tus enlaces, crea categorías y filtra por favoritos para encontrar lo que buscas en segundos.",
                    },
                    {
                        icon: <ArrowRight className="w-6 h-6" />,
                        title: "Comparte con quien quieras",
                        description: "Genera colecciones públicas o privadas para compartir tus mejores recursos con tu equipo o amigos.",
                    },
                ].map(({ icon, title, description }) => (
                    <motion.article
                        key={title}
                        variants={child}
                        className="rounded-2xl bg-white/70 backdrop-blur border border-gray-200 p-6 shadow-lg hover:scale-[1.02] transition-transform"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                    </motion.article>
                ))}
            </motion.section>

            <motion.footer variants={child} className="text-sm text-gray-500 mt-24">
                Hecho con ❤️ y café — © {new Date().getFullYear()} LinkNest
            </motion.footer>
        </motion.main>
    );
}
