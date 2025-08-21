import { describe, it, expect } from 'vitest';
import { buildTree } from './categoryTree';
import type { Category } from '../types/category';

describe('buildTree', () => {
    it('creates nested structure', () => {
        const flat: Category[] = [
            { id: '1', name: 'root', parent_id: null, position: 0 },
            { id: '2', name: 'child', parent_id: '1', position: 0 },
            { id: '3', name: 'sibling', parent_id: null, position: 1 },
        ];
        const tree = buildTree(flat);
        expect(tree).toHaveLength(2);
        expect(tree[0].children).toHaveLength(1);
        expect(tree[0].children[0].name).toBe('child');
    });
});
