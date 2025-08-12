import { Trash } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteCategoryDialogProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    text?: string;
}

export default function ConfirmDeleteCategoryDialog({ open, onCancel, onConfirm, text }: ConfirmDeleteCategoryDialogProps) {
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
            <div className={`bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 min-w-[300px] flex flex-col items-center transform transition-all duration-200 ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'}`}>
                <Trash size={32} className="text-red-400 mb-2" />
                <h2 className="text-lg font-semibold mb-2">
                    {t('categories.actions.delete.titleDialog')}
                </h2>
                <p className="text-gray-400 mb-4 text-center">{text || t('categories.actions.delete.clarification')}</p>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200"
                        onClick={onCancel}
                    >
                        {t('categories.actions.delete.buttonCancel')}
                    </button>
                    <button
                        className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                        onClick={onConfirm}
                    >
                        {t('categories.actions.delete.buttonConfirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
