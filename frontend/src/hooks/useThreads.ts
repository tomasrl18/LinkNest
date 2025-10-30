import { useCallback, useEffect, useState } from 'react';
import type { Thread } from '../types/thread';
import {
    getThreads as getThreadsSvc,
    createThread as createThreadSvc,
    updateThread as updateThreadSvc,
    deleteThread as deleteThreadSvc,
} from '../lib/threads.service';

export function useThreads() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchThreads = useCallback(async () => {
        setLoading(true);
        const { data, error } = await getThreadsSvc();
        if (error) setError(error);
        setThreads((data ?? []) as Thread[]);
        setLoading(false);
    }, []);

    const createThread = useCallback(async (
        payload: Omit<Thread, 'id' | 'created_at' | 'updated_at'>
    ) => {
        const { data, error } = await createThreadSvc(payload);
        if (error) throw error;
        if (data) setThreads(prev => [data as Thread, ...prev]);
        return data as Thread;
    }, []);

    const updateThread = useCallback(async (id: string, patch: Partial<Thread>) => {
        setThreads(prev => prev.map(t => (t.id === id ? { ...t, ...patch } as Thread : t)));
        const { data, error } = await updateThreadSvc(id, patch);
        if (error) throw error;
        if (data) setThreads(prev => prev.map(t => (t.id === id ? (data as Thread) : t)));
        return data as Thread;
    }, []);

    const deleteThread = useCallback(async (id: string) => {
        const snapshot = threads;
        setThreads(prev => prev.filter(t => t.id !== id));
        const { error } = await deleteThreadSvc(id);
        if (error) {
            setThreads(snapshot);
            throw error;
        }
    }, [threads]);

    useEffect(() => {
        fetchThreads();
    }, [fetchThreads]);

    return { threads, loading, error, fetchThreads, createThread, updateThread, deleteThread };
}

