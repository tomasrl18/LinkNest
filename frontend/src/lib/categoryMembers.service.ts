import { supabase } from './supabase';

export async function getCategoryMembers(categoryId: string) {
    return supabase
        .from('category_members')
        .select('*, profiles!category_members_user_id_fkey ( email )')
        .eq('category_id', categoryId);
}

export async function addCategoryMember(categoryId: string, email: string) {
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
    if (profileError) return { data: null, error: profileError };
    return supabase
        .from('category_members')
        .insert({ category_id: categoryId, user_id: profile.id })
        .single();
}

export async function removeCategoryMember(id: string) {
    return supabase.from('category_members').delete().eq('id', id);
}