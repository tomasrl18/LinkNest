import { supabase } from './supabase'

export type UsageSummary = {
    total_links: number
    top_links: { id: string; title: string; url: string; open_count: number }[]
    never_opened: { id: string; title: string; url: string }[]
}

type Params = { from: string; to: string }

function normalizeSummary(row: unknown): UsageSummary {
    const obj = typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : {}
    const safeTop = Array.isArray(obj.top_links) ? obj.top_links : []
    const safeNever = Array.isArray(obj.never_opened) ? obj.never_opened : []

    const top_links = safeTop.map((l: unknown) => {
        const item = typeof l === 'object' && l !== null ? (l as Record<string, unknown>) : {}
        return {
            id: String(item.id ?? ''),
            title: String(item.title ?? ''),
            url: String(item.url ?? ''),
            open_count: Number(item.open_count ?? 0),
        }
    })

    const never_opened = safeNever.map((l: unknown) => {
        const item = typeof l === 'object' && l !== null ? (l as Record<string, unknown>) : {}
        return {
            id: String(item.id ?? ''),
            title: String(item.title ?? ''),
            url: String(item.url ?? ''),
        }
    })

    return {
        total_links: Number(obj?.total_links ?? 0),
        top_links,
        never_opened,
    }
}

export async function getUsageSummary({ from, to }: Params): Promise<{ data: UsageSummary; error: unknown }> {
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
