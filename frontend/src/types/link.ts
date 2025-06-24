export interface Link {
    id: string;
    user_id: string;
    url: string;
    title: string | null;
    description: string | null;
    category: string | null;
    tags: string[] | null;
    favorite: boolean;
    created_at: string;
}