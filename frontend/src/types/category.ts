export interface Category {
    id: string;
    name: string;
    user_id?: string;
    parent_id: string | null;
    position: number;
    created_at?: string;
    children?: Category[];
}
