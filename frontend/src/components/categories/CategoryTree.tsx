import { useState } from 'react';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategoryNode } from '../../lib/categoryTree';
import { Plus, MoreVertical, Trash, Pencil } from 'lucide-react';

interface TreeProps {
    tree: CategoryNode[];
    onCreate(parent: string | null): void;
    onRename(id: string): void;
    onDelete(id: string): void;
    onMove?(id: string, parentId: string | null, position: number): void;
    onReorder(parentId: string | null, orderedIds: string[]): void;
}

export function CategoryTree({ tree, onCreate, onRename, onDelete, onReorder }: TreeProps) {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;
        // Only handle reordering among same level for simplicity
        const findParent = (nodes: CategoryNode[], id: string, parent: CategoryNode | null): CategoryNode | null => {
            for (const n of nodes) {
                if (n.id === id) return parent;
                const p = findParent(n.children, id, n);
                if (p) return p;
            }
            return null;
        };
        const parent = findParent(tree, active.id as string, null);
        const siblings = parent ? parent.children : tree;
        const oldIndex = siblings.findIndex(c => c.id === active.id);
        const newIndex = siblings.findIndex(c => c.id === over.id);
        const reordered = arrayMove(siblings, oldIndex, newIndex).map(s => s.id);
        if (parent) onReorder(parent.id, reordered);
        else onReorder(null, reordered);
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={tree.map(n => n.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1">
                    {tree.map(node => (
                        <TreeNode key={node.id} node={node} depth={0} onCreate={onCreate} onRename={onRename} onDelete={onDelete} />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}

interface NodeProps {
    node: CategoryNode;
    depth: number;
    onCreate(parent: string | null): void;
    onRename(id: string): void;
    onDelete(id: string): void;
}

function TreeNode({ node, depth, onCreate, onRename, onDelete }: NodeProps) {
    const [expanded, setExpanded] = useState(true);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: node.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <li ref={setNodeRef} style={{ ...style, paddingLeft: depth * 16 }}>
            <div className="flex items-center gap-1">
                <button aria-label="drag" {...listeners} {...attributes} className="cursor-move p-1">
                    <MoreVertical size={14} />
                </button>
                {node.children.length > 0 && (
                    <button onClick={() => setExpanded(e => !e)} aria-label="toggle" className="p-1">
                        {expanded ? '-' : '+'}
                    </button>
                )}
                <span className="flex-1">{node.name}</span>
                <button onClick={() => onCreate(node.id)} aria-label="add" className="p-1">
                    <Plus size={14} />
                </button>
                <button onClick={() => onRename(node.id)} aria-label="rename" className="p-1">
                    <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(node.id)} aria-label="delete" className="p-1 text-red-500">
                    <Trash size={14} />
                </button>
            </div>
            {expanded && node.children.length > 0 && (
                <SortableContext items={node.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <ul className="pl-4">
                        {node.children.map(child => (
                            <TreeNode key={child.id} node={child} depth={depth + 1} onCreate={onCreate} onRename={onRename} onDelete={onDelete} />
                        ))}
                    </ul>
                </SortableContext>
            )}
        </li>
    );
}
