import { supabase } from './supabase';
import type { Thread, ThreadLink } from '../types/thread';

export async function getThreads() {
    return supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false });
}

export async function getThreadWithLinks(threadId: string) {
    return supabase
        .from('threads')
        .select(
            `*,
             thread_links (*, links (*, categories ( id, name )))`
        )
        .eq('id', threadId)
        .single();
}

export async function createThread(
    payload: Omit<Thread, 'id' | 'created_at' | 'updated_at'>
) {
    return supabase
        .from('threads')
        .insert(payload)
        .single();
}

export async function updateThread(id: string, patch: Partial<Thread>) {
    return supabase
        .from('threads')
        .update(patch)
        .eq('id', id)
        .single();
}

export async function deleteThread(id: string) {
    return supabase
        .from('threads')
        .delete()
        .eq('id', id);
}

export async function addLinkToThread(
    threadId: string,
    linkId: string,
    position?: number,
    note?: string | null
) {
    const insert: Partial<ThreadLink> = {
        thread_id: threadId,
        link_id: linkId,
        position: position ?? 0,
        note: note ?? null,
    } as ThreadLink;
    return supabase
        .from('thread_links')
        .insert(insert)
        .single();
}

export async function updateThreadLink(id: string, patch: Partial<ThreadLink>) {
    return supabase
        .from('thread_links')
        .update(patch)
        .eq('id', id)
        .single();
}

export async function removeLinkFromThreadById(threadLinkId: string) {
    return supabase
        .from('thread_links')
        .delete()
        .eq('id', threadLinkId);
}

export async function removeLinkFromThread(threadId: string, linkId: string) {
    return supabase
        .from('thread_links')
        .delete()
        .match({ thread_id: threadId, link_id: linkId });
}

