import { Upload, HelpCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLinks } from "../../hooks/useLinks";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-hot-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

interface ImportBookmarksDialogProps {
    open: boolean;
    onClose: () => void;
}

const ImportBookmarksDialog: React.FC<ImportBookmarksDialogProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const { addLink } = useLinks();
    const { user } = useAuth();

    const [show, setShow] = useState(open);
    const [animate, setAnimate] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            setShow(true);
            setTimeout(() => setAnimate(true), 10);
        } else if (show) {
            setAnimate(false);
            timeoutRef.current = window.setTimeout(() => setShow(false), 200);
        }
        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [open, show]);

    useEffect(() => {
        if (!show) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [show, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === backdropRef.current) onClose();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const anchors = Array.from(doc.querySelectorAll("a"));
            let count = 0;
            for (const a of anchors) {
                const href = a.getAttribute("href");
                if (!href) continue;
                try {
                    await addLink({
                        url: href,
                        title: a.textContent?.trim() || null,
                        description: null,
                        category_id: null,
                        tags: null,
                        favorite: false,
                        user_id: user?.id || "",
                    });
                    count++;
                } catch (err) {
                    console.error(err);
                }
            }
            toast.success(t('links.import.success', { count }));
        } catch (err) {
            console.error(err);
            toast.error(t('links.import.error'));
        } finally {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-200 ${animate ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className={`bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 min-w-[300px] flex flex-col items-center transform transition-all duration-200 ${animate ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'}`}>
                <Upload size={32} className="text-indigo-400 mb-2" />
                <h2 className="text-lg font-semibold mb-2">
                    {t('links.import.title')}
                </h2>
                <div className="flex items-center justify-center text-gray-400 mb-4">
                    <p className="text-center">{t('links.import.howTo')}</p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle size={16} className="ml-2 cursor-help text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('links.import.tooltip')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileChange}
                    className="mb-4 cursor-pointer"
                />
                <button
                    className="px-4 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 cursor-pointer"
                    onClick={onClose}
                >
                    {t('links.import.close')}
                </button>
            </div>
        </div>
    );
};

export default ImportBookmarksDialog;