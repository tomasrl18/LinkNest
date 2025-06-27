export const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

import type { Transition } from "framer-motion";

export const pageTransition: Transition = {
    duration: 0.5,
    ease: "easeInOut",
};
