import { supabase } from './supabase';
import type { Category } from '../types/category';
import { buildTree, type CategoryNode } from './categoryTree';

export async function getTree(): Promise<CategoryNode[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position', { ascending: true });
    if (error) throw error;
    return buildTree(data as Category[]);
}

export async function create(payload: { name: string; parent_id: string | null; position?: number; user_id?: string }) {
    const { data, error } = await supabase
        .from('categories')
        .insert({
            name: payload.name,
            parent_id: payload.parent_id,
            position: payload.position ?? 0,
            user_id: payload.user_id,
        })
        .single();
    if (error) throw error;
    return data as Category;
}

export async function rename(id: string, name: string) {
    const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as Category;
}

export async function remove(id: string) {
    // children will be moved to root by DB trigger or constraint
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
}

export async function move(id: string, new_parent_id: string | null, position: number) {
    const { error } = await supabase.rpc('move_category', {
        cat_id: id,
        new_parent: new_parent_id,
        new_position: position,
    });
    if (error) throw error;
}

export async function reorder(parent_id: string | null, ordered_ids: string[]) {
    const { error } = await supabase.rpc('reorder_categories', {
        p_parent: parent_id,
        ordered: ordered_ids,
    });
    if (error) throw error;
}

// Legacy flat helpers for compatibility
export async function getCategories() {
    return supabase.from('categories').select('*');
}

export async function addCategory(data: { name: string; user_id?: string; parent_id?: string | null; position?: number }) {
    return supabase
        .from('categories')
        .insert({
            name: data.name,
            user_id: data.user_id,
            parent_id: data.parent_id ?? null,
            position: data.position ?? 0,
        })
        .single();
}

export async function updateCategory(id: string, patch: Partial<Category>) {
    return supabase.from('categories').update(patch).eq('id', id).single();
}

export async function deleteCategory(id: string) {
    return supabase.from('categories').delete().eq('id', id);
}
