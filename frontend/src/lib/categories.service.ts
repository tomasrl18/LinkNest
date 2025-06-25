import { supabase } from './supabase';
import type { Category } from '../types/category';

export async function getCategories() {
    return supabase.from('categories').select('*').order('created_at', { ascending: false });
}

export async function addCategory(data: Omit<Category, 'id' | 'created_at'>) {
    return supabase.from('categories').insert(data).single();
}