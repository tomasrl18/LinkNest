// src/lib/links.service.ts
import { supabase } from './supabase';
import type { Link } from '../types/link';

export async function addLink(data: Omit<Link, 'id' | 'created_at'>) {
  return supabase.from('links').insert(data).single();
}

export async function getLinks() {
  return supabase.from('links').select('*').order('created_at', { ascending: false });
}

export async function updateLink(id: string, patch: Partial<Link>) {
  return supabase.from('links').update(patch).eq('id', id).single();
}

export async function deleteLink(id: string) {
  return supabase.from('links').delete().eq('id', id);
}
