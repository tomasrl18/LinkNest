import type { Category } from '../types/category';

export interface CategoryNode extends Category {
    children: CategoryNode[];
}

export function buildTree(categories: Category[]): CategoryNode[] {
    const map: Record<string, CategoryNode> = {};
    const roots: CategoryNode[] = [];
    const sorted = [...categories].sort((a, b) => a.position - b.position);

    sorted.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    Object.values(map).forEach(node => {
        if (node.parent_id && map[node.parent_id]) {
            map[node.parent_id].children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}
