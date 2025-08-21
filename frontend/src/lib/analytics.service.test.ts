import { describe, it, expect, vi } from 'vitest';
import { trackOpen, getUsageSummary } from './analytics.service';

vi.mock('./supabase', () => ({
    supabase: {
        rpc: vi.fn().mockResolvedValue({ data: null, error: null })
    }
}));

describe('analytics.service', () => {
    it('calls track_open rpc', async () => {
        const { supabase } = await import('./supabase');
        await trackOpen('123');
        expect(supabase.rpc).toHaveBeenCalledWith('track_open', { _link_id: '123' });
    });

    it('calls get_usage_summary rpc', async () => {
        const { supabase } = await import('./supabase');
        await getUsageSummary({ from: '2024-01-01', to: '2024-01-31' });
        expect(supabase.rpc).toHaveBeenCalledWith('get_usage_summary', { _from: '2024-01-01', _to: '2024-01-31' });
    });
});
