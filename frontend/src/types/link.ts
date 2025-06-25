import type { Category } from './category';

export interface Link {
    id: string;
    user_id: string;
    url: string;
    title: string | null;
    description: string | null;
    category_id: string | null;
    category?: Category | null;
    tags: string[] | null;
    favorite: boolean;
    created_at: string;
}