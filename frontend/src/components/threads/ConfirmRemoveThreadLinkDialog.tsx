import { Trash } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmRemoveThreadLinkDialogProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    text?: string;
}

export default function ConfirmRemoveThreadLinkDialog({ open, onCancel, onConfirm, text }: ConfirmRemoveThreadLinkDialogProps) {
    const { t } = useTranslation();
    const [show, setShow] = useState(open);
    const [animate, setAnimate] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (open) {
            setShow(true);
            setTimeout(() => setAnimate(true), 10);
        } else if (show) {
            setAnimate(false);
            timeoutRef.current = setTimeout(() => setShow(false), 200);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [open, show]);

    useEffect(() => {
        if (!show) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [show, onCancel]);

    const backdropRef = useRef<HTMLDivElement>(null);
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === backdropRef.current) onCancel();
    };

    if (!show) return null;

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-200 ${animate ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className={`rounded-2xl p-6 shadow-xl border min-w-[300px] flex flex-col items-center transform transition-all duration-200 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800 ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'}`}>
                <Trash size={32} className="text-red-400 mb-2" />
                <h2 className="text-lg font-semibold mb-2">
                    {t('threads.remove.title')}
                </h2>
                <p className="text-gray-700 dark:text-gray-400 mb-4 text-center">{text || t('threads.remove.clarification')}</p>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
                        onClick={onCancel}
                    >
                        {t('threads.remove.buttonCancel')}
                    </button>
                    <button
                        className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                        onClick={onConfirm}
                    >
                        {t('threads.remove.buttonConfirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
