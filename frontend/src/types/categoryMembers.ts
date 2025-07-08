export interface CategoryMember {
    id: string;
    category_id: string;
    user_id: string;
    created_at: string;
    profile?: { email: string } | null;
}