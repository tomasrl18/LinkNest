import { useCallback, useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    prompt(): Promise<void>;
}

function isStandalone() {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia?.('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
}

function isIosDevice() {
    if (typeof window === 'undefined') return false;
    const navigatorInfo = window.navigator as { userAgent: string; platform?: string; maxTouchPoints?: number };
    const userAgent = navigatorInfo.userAgent.toLowerCase();
    const platform = navigatorInfo.platform?.toLowerCase() ?? '';
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
    const touchPoints = navigatorInfo.maxTouchPoints ?? 0;
    const isTouchMac = platform === 'macintel' && touchPoints > 1;
    return isAppleMobile || isTouchMac;
}

function isSafariBrowser() {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent;
    return /Safari/i.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
}

type InstallPromptResult = 'accepted' | 'dismissed' | 'manual' | 'unavailable';

export function usePwaInstall() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState<boolean>(isStandalone());

    const requiresManualInstall = useMemo(() => {
        if (installed) return false;
        return isIosDevice() && isSafariBrowser() && !isStandalone();
    }, [installed]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setPromptEvent(event as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setInstalled(true);
            setPromptEvent(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async (): Promise<InstallPromptResult> => {
        if (requiresManualInstall) {
            return 'manual';
        }

        if (!promptEvent) {
            return 'unavailable';
        }
        try {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            if (choice.outcome === 'accepted') {
                setInstalled(true);
            }
            return choice.outcome;
        } catch (error) {
            console.warn('Install prompt failed', error);
            return 'dismissed';
        } finally {
            setPromptEvent(null);
        }
    }, [promptEvent, requiresManualInstall]);

    const isInstallable = !installed && (requiresManualInstall || !!promptEvent);

    return {
        isInstallable,
        promptInstall,
        requiresManualInstall,
    };
}
