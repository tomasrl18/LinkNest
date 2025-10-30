import { useCallback, useEffect, useState } from 'react';
import type { Thread, ThreadLink } from '../types/thread';
import {
    getThreadWithLinks as getThreadWithLinksSvc,
    addLinkToThread as addLinkToThreadSvc,
    updateThreadLink as updateThreadLinkSvc,
    removeLinkFromThread as removeLinkFromThreadSvc,
} from '../lib/threads.service';

interface ThreadWithItems extends Thread {
    thread_links?: ThreadLink[];
}

export function useThread(threadId: string | null) {
    const [thread, setThread] = useState<ThreadWithItems | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchThread = useCallback(async () => {
        if (!threadId) return;
        setLoading(true);
        const { data, error } = await getThreadWithLinksSvc(threadId);
        if (error) setError(error);
        setThread((data ?? null) as ThreadWithItems | null);
        setLoading(false);
    }, [threadId]);

    const addLink = useCallback(async (linkId: string, position?: number, note?: string | null) => {
        if (!threadId) return;
        const { data, error } = await addLinkToThreadSvc(threadId, linkId, position, note);
        if (error) throw error;
        if (data) setThread(prev => (prev ? { ...prev, thread_links: [...(prev.thread_links ?? []), data as ThreadLink] } : prev));
    }, [threadId]);

    const updateItem = useCallback(async (itemId: string, patch: Partial<ThreadLink>) => {
        const { data, error } = await updateThreadLinkSvc(itemId, patch);
        if (error) throw error;
        if (data) setThread(prev => (
            prev ? { ...prev, thread_links: (prev.thread_links ?? []).map(i => i.id === itemId ? (data as ThreadLink) : i) } : prev
        ));
    }, []);

    const removeLink = useCallback(async (linkId: string) => {
        if (!threadId) return;
        // Optimistic update
        setThread(prev => prev ? { ...prev, thread_links: (prev.thread_links ?? []).filter(i => i.link_id !== linkId) } : prev);
        const { error } = await removeLinkFromThreadSvc(threadId, linkId);
        if (error) await fetchThread();
    }, [threadId, fetchThread]);

    useEffect(() => {
        fetchThread();
    }, [fetchThread]);

    return { thread, loading, error, fetchThread, addLink, updateItem, removeLink };
}

