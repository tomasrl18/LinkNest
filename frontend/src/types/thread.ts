import type { Link } from './link';

export interface Thread {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    tags: string[] | null;
    is_public?: boolean;
    created_at: string;
    updated_at?: string;
}

export interface ThreadLink {
    id: string;
    thread_id: string;
    link_id: string;
    position: number;
    note: string | null;
    created_at: string;
    // When joining with Supabase, we can hydrate the link
    links?: Link;
}

