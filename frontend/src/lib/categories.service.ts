import { supabase } from './supabase';
import type { Category } from '../types/category';

export async function getCategories() {
    return supabase.from('categories').select('*').order('created_at', { ascending: false });
}

export async function addCategory(data: Omit<Category, 'id' | 'created_at'>) {
    return supabase.from('categories').insert(data).single();
}

export async function updateCategory(id: string, patch: Partial<Category>) {
    return supabase.from('categories').update(patch).eq('id', id).single();
}

export async function deleteCategory(id: string) {
    return supabase.from('categories').delete().eq('id', id);
}