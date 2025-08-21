import { useEffect, useState, useCallback } from 'react';
import type { CategoryNode } from '../lib/categoryTree';
import * as svc from '../lib/categories.service';

export function useCategoryTree() {
    const [tree, setTree] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTree = useCallback(async () => {
        try {
            setLoading(true);
            const data = await svc.getTree();
            setTree(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(
        async (name: string, parent_id: string | null, user_id?: string) => {
            const cat = await svc.create({ name, parent_id, user_id });
            await fetchTree();
            return cat;
        },
    [fetchTree]);

    const rename = useCallback(
        async (id: string, name: string) => {
            await svc.rename(id, name);
            await fetchTree();
        },
    [fetchTree]);

    const remove = useCallback(
        async (id: string) => {
            await svc.remove(id);
            await fetchTree();
        },
    [fetchTree]);

    const move = useCallback(
        async (id: string, new_parent_id: string | null, position: number) => {
            await svc.move(id, new_parent_id, position);
            await fetchTree();
        },
    [fetchTree]);

    const reorder = useCallback(
        async (parent_id: string | null, ordered_ids: string[]) => {
            await svc.reorder(parent_id, ordered_ids);
            await fetchTree();
        },
    [fetchTree]);

    useEffect(() => { fetchTree(); }, [fetchTree]);

    return { tree, loading, error, fetchTree, create, rename, remove, move, reorder };
}
