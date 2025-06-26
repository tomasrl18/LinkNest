import { useEffect, useState, useCallback } from 'react';
import type { Category } from '../types/category';
import {
    getCategories,
    addCategory,
    updateCategory as updateCategorySvc,
    deleteCategory as deleteCategorySvc
} from '../lib/categories.service';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const { data, error } = await getCategories();
        if (error) {
            setError(error);
        } else {
            setCategories(data ?? []);
        }
        setLoading(false);
    }, []);

    const createCategory = useCallback(
        async (payload: Omit<Category, 'id' | 'created_at'>) => {
            const { data: created, error } = await addCategory(payload);
            if (error) throw error;
            if (created) setCategories(prev => [created as Category, ...prev]);
            return created as Category | null;
        },
    []);

    const updateCategory = useCallback(
        async (id: string, patch: Partial<Category>) => {
            setCategories(prev =>
                prev.map(c => (c.id === id ? { ...c, ...patch } : c)),
            );

            const { data: updated, error } = await updateCategorySvc(id, patch);
            if (error) {
                await fetchCategories();
                throw error;
            }

            if (updated) {
                setCategories(prev =>
                    prev.map(c => (c.id === id ? (updated as Category) : c)),
                );
            }
        },
    [fetchCategories]);

    const deleteCategory = useCallback(
        async (id: string) => {
            const snapshot = categories;
            setCategories(prev => prev.filter(c => c.id !== id));
            const { error } = await deleteCategorySvc(id);
            if (error) {
                setCategories(snapshot);
                throw error;
            }
        },
    [categories]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}