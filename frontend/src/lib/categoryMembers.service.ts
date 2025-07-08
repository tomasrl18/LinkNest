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
        .maybeSingle();

    if (profileError) return { error: profileError, data: null };
    if (!profile) return { error: 'Usuario no encontrado', data: null };

    const { error: insertError } = await supabase
        .from('category_members')
        .insert(
            { category_id: categoryId, user_id: profile.id },
            { returning: 'minimal' }   // no intentes devolver la fila insertada
        );
    
    if (insertError)  return { error: insertError, data: null };
    return { error: null, data: null };
}

export async function removeCategoryMember(id: string) {
    return supabase.from('category_members').delete().eq('id', id);
}