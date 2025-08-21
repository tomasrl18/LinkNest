import { supabase } from './supabase';

export async function trackOpen(linkId: string) {
    return supabase.rpc('track_open', { _link_id: linkId });
}

export interface UsageSummaryParams {
    from: string;
    to: string;
}

export async function getUsageSummary(params: UsageSummaryParams) {
    return supabase.rpc('get_usage_summary', { _from: params.from, _to: params.to });
}
