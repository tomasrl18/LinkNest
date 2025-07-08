import { useState, useCallback } from 'react';
import type { CategoryMember } from '../types/categoryMembers';
import {
    getCategoryMembers,
    addCategoryMember,
    removeCategoryMember,
} from '../lib/categoryMembers.service';

export function useCategoryMembers(categoryId: string) {
    const [members, setMembers] = useState<CategoryMember[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await getCategoryMembers(categoryId);
        if (!error) setMembers((data ?? []) as CategoryMember[]);
        setLoading(false);
    }, [categoryId]);

    const addMember = useCallback(
        async (email: string) => {
            const { data, error } = await addCategoryMember(categoryId, email);
            if (error) throw error;
            if (data) setMembers(prev => [...prev, data as CategoryMember]);
            await fetchMembers();
        },
        [categoryId, fetchMembers],
    );

    const removeMember = useCallback(
        async (id: string) => {
            const snapshot = members;
            setMembers(prev => prev.filter(m => m.id !== id));
            const { error } = await removeCategoryMember(id);
            if (error) setMembers(snapshot);
        },
        [members],
    );

    return { members, loading, fetchMembers, addMember, removeMember };
}