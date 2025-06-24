import { useState, useEffect, useCallback } from 'react';
import type { Link } from '../types/link'; 
import {
    addLink as addLinkSvc,
    getLinks as getLinksSvc,
    updateLink as updateLinkSvc,
    deleteLink as deleteLinkSvc,
} from '../lib/links.service';

export function useLinks() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchLinks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await getLinksSvc(); 
        if (error) {
            setError(error);
        } else {
            setLinks(data ?? []);
        }
        setLoading(false);
    }, []);

    const addLink = useCallback(
        async (payload: Omit<Link, 'id' | 'created_at'>) => {
            const { data: created, error } = await addLinkSvc(payload);
            if (error) throw error;
            if (created) setLinks(prev => [created as Link, ...prev]);
        },
    []);

    const updateLink = useCallback(
        async (id: string, patch: Partial<Link>) => {
            setLinks(prev =>
                prev.map(l => (l.id === id ? { ...l, ...patch } : l)),
            );

            const { data: updated, error } = await updateLinkSvc(id, patch);
            if (error) {
                await fetchLinks();
                throw error;
            }

            if (updated) {
                setLinks(prev =>
                    prev.map(l => (l.id === id ? (updated as Link) : l)),
                );
            }
        },
    [fetchLinks]);

    const deleteLink = useCallback(
        async (id: string) => {
            const snapshot = links;
            setLinks(prev => prev.filter(l => l.id !== id));
            const { error } = await deleteLinkSvc(id);
            if (error) {
                setLinks(snapshot);
                throw error;
            }
        },
    [links]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    return { links, loading, error, fetchLinks, addLink, updateLink, deleteLink };
}