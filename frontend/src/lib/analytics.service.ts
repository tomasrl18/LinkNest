import { supabase } from './supabase'

export type UsageSummary = {
    total_links: number
    top_links: { id: string; title: string; url: string; open_count: number }[]
    never_opened: { id: string; title: string; url: string }[]
}

type Params = { from: string; to: string }

function normalizeSummary(row: any): UsageSummary {
    const safeTop = Array.isArray(row?.top_links) ? row.top_links : []
    const safeNever = Array.isArray(row?.never_opened) ? row.never_opened : []

    const top_links = safeTop.map((l: any) => ({
        id: String(l.id),
        title: String(l.title ?? ''),
        url: String(l.url ?? ''),
        open_count: Number(l.open_count ?? 0),
    }))

    const never_opened = safeNever.map((l: any) => ({
        id: String(l.id),
        title: String(l.title ?? ''),
        url: String(l.url ?? ''),
    }))

    return {
        total_links: Number(row?.total_links ?? 0),
        top_links,
        never_opened,
    }
}

export async function getUsageSummary({ from, to }: Params): Promise<{ data: UsageSummary; error: any }> {
    const { data, error } = await supabase.rpc('get_usage_summary', { _from: from, _to: to })
    if (error) {
        return { data: { total_links: 0, top_links: [], never_opened: [] }, error }
    }

    const row = Array.isArray(data) ? data[0] : data
    const normalized = normalizeSummary(row ?? {})
    return { data: normalized, error: null }
}

export async function trackOpen(linkId: string) {
    const { error } = await supabase.rpc('track_open', { _link_id: linkId })
    return { error }
}
