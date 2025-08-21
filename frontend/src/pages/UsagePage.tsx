import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LinkCard from '../components/links/LinkCard'
import { getUsageSummary } from '../lib/analytics.service'
import { getPresetRange } from '../lib/dateRange'
import type { Preset } from '../lib/dateRange'

interface Summary {
    total_links: number
    top_links: { id: string; title: string; url: string; open_count: number }[]
    never_opened: { id: string; title: string; url: string }[]
}

export function UsagePage() {
    const { t } = useTranslation()
    const [preset, setPreset] = useState<Preset | 'custom'>('7d')
    const [range, setRange] = useState(() => getPresetRange('7d'))
    const [customFrom, setCustomFrom] = useState('')
    const [customTo, setCustomTo] = useState('')
    const [summary, setSummary] = useState<Summary | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false
        const load = async () => {
            setLoading(true)
            setError(null)
            const { data, error } = await getUsageSummary({
                from: range.from.toISOString(),
                to: range.to.toISOString(),
            })
            if (ignore) return
            if (error) setError(error.message ?? 'Error')
            setSummary(data)
            setLoading(false)
        }
        load()
        return () => {
            ignore = true
        }
    }, [range])

    const handlePreset = (p: Preset | 'custom') => {
        setPreset(p)
        if (p === 'custom') return
        const r = getPresetRange(p)
        setRange(r)
    }

    const handleCustomChange = (f: string, t: string) => {
        setCustomFrom(f)
        setCustomTo(t)
        if (f && t) {
            setRange({ from: new Date(f), to: new Date(t) })
        }
    }

    const handleOpened = (id: string) => {
        setSummary(s =>
            s
                ? {
                    ...s,
                    never_opened: (s.never_opened ?? []).filter(l => l.id !== id),
                }
                : s
        )
    }

    return (
        <main className="p-4 text-white">
            <section className="mb-4">
                <label className="mr-2">{t('usage.filter.range')}</label>
                <select
                    value={preset}
                    onChange={e => handlePreset(e.target.value as Preset | 'custom')}
                    className="text-black"
                >
                    <option value="today">{t('usage.filter.today')}</option>
                    <option value="7d">{t('usage.filter.7d')}</option>
                    <option value="30d">{t('usage.filter.30d')}</option>
                    <option value="custom">{t('usage.filter.custom')}</option>
                </select>
                {preset === 'custom' && (
                    <span className="ml-2">
                        <input
                            type="date"
                            value={customFrom}
                            onChange={e => handleCustomChange(e.target.value, customTo)}
                            className="text-black mr-1"
                        />
                        <input
                            type="date"
                            value={customTo}
                            onChange={e => handleCustomChange(customFrom, e.target.value)}
                            className="text-black"
                        />
                    </span>
                )}
            </section>

            {error && <p className="text-red-400">{error}</p>}

            {summary && !loading && (
                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold">{t('usage.total')}</h2>
                        <p>{summary.total_links ?? 0}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">{t('usage.top')}</h2>
                        <ul className="space-y-2">
                            {(summary.top_links ?? []).map(l => (
                                <li key={l.id} className="border p-2 rounded">
                                    <a href={l.url} target="_blank" rel="noreferrer" className="underline">
                                        {l.title}
                                    </a>{' '}
                                    - {l.open_count}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">{t('usage.never')}</h2>
                        <ul className="space-y-2">
                            {(summary.never_opened ?? []).map(l => (
                                <li key={l.id} className="border p-2 rounded">
                                    <LinkCard
                                        link={{ id: l.id, url: l.url, title: l.title }}
                                        onOpen={() => handleOpened(l.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </main>
    )
}

export default UsagePage
