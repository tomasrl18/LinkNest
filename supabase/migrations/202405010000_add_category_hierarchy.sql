-- Add hierarchical categories: parent_id and position
ALTER TABLE categories
    ADD COLUMN parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    ADD COLUMN position integer NOT NULL DEFAULT 0;

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);
CREATE INDEX IF NOT EXISTS categories_position_idx ON categories(position);

-- Ensure each user can manage only their categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_owns_category" ON categories
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Move children to root when a category is deleted
CREATE OR REPLACE FUNCTION before_delete_category()
RETURNS trigger AS $$
BEGIN
    UPDATE categories SET parent_id = NULL WHERE parent_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_before_delete
BEFORE DELETE ON categories
FOR EACH ROW EXECUTE FUNCTION before_delete_category();

-- RPC: move category
CREATE OR REPLACE FUNCTION move_category(cat_id uuid, new_parent uuid, new_position integer)
RETURNS void AS $$
DECLARE
    has_cycle boolean;
BEGIN
    IF cat_id = new_parent THEN
        RAISE EXCEPTION 'Cannot set parent to itself';
    END IF;

    WITH RECURSIVE sub(id) AS (
        SELECT id FROM categories WHERE parent_id = cat_id
        UNION
        SELECT c.id FROM categories c JOIN sub s ON c.parent_id = s.id
    )
    SELECT EXISTS(SELECT 1 FROM sub WHERE id = new_parent) INTO has_cycle;
    IF has_cycle THEN
        RAISE EXCEPTION 'Cannot move category inside its subtree';
    END IF;

    UPDATE categories SET parent_id = new_parent, position = new_position WHERE id = cat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: reorder siblings
CREATE OR REPLACE FUNCTION reorder_categories(p_parent uuid, ordered uuid[])
RETURNS void AS $$
DECLARE
    idx integer := 1;
    cat uuid;
BEGIN
    FOREACH cat IN ARRAY ordered LOOP
        UPDATE categories SET position = idx WHERE id = cat AND parent_id IS NOT DISTINCT FROM p_parent;
        idx := idx + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
