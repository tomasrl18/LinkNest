import { supabase } from './supabase';

export async function getCategoryMembers(categoryId: string) {
    return supabase
        .from('category_members')
        .select('*, profiles!category_members_user_id_fkey ( email )')
        .eq('category_id', categoryId);
}

export async function addCategoryMember(categoryId: string, email: string) {
    const { data: userId, error: rpcError } = await supabase
        .rpc('get_profile_id_by_email', { _email: email })
        .single();

    if (rpcError) return { error: rpcError, data: null };
    if (!userId)   return { error: 'Usuario no encontrado', data: null };

    const { error: insertError } = await supabase
        .from('category_members')
        .insert(
            { category_id: categoryId, user_id: userId }
        );

    if (insertError) return { error: insertError, data: null };
    return { error: null, data: null };
}

export async function removeCategoryMember(id: string) {
    return supabase.from('category_members').delete().eq('id', id);
}