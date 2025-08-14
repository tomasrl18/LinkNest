import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { pageVariants, pageTransition } from "../animations/pageVariants";

export function PrivacyPolicyPage() {
    const { t } = useTranslation();
    const paragraphs = t("privacy.paragraphs", { returnObjects: true }) as string[];

    return (
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[calc(100dvh-80px)] flex items-start justify-center pt-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
        >
            <motion.article
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
                className="w-full max-w-3xl rounded-2xl bg-gray-900/80 backdrop-blur border border-gray-800 p-8 shadow-lg text-gray-300"
            >
                <h1 className="text-3xl font-bold mb-6 text-gray-100">{t("privacy.title")}</h1>
                <div className="space-y-4 text-sm leading-relaxed">
                    {paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                    ))}
                </div>
            </motion.article>
        </motion.section>
    );
}