import { describe, it, expect, vi } from 'vitest';
import { getPresetRange } from './dateRange';

describe('getPresetRange', () => {
    it('returns last 7 days range', () => {
        vi.setSystemTime(new Date('2024-01-10T00:00:00Z'));
        const { from, to } = getPresetRange('7d');
        expect(to.toISOString()).toBe(new Date('2024-01-10T00:00:00Z').toISOString());
        expect(from.toISOString()).toBe(new Date('2024-01-03T00:00:00.000Z').toISOString());
    });
});
