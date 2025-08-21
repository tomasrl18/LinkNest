import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import LinkCard from '../components/links/LinkCard'
import { getUsageSummary } from '../lib/analytics.service'
import { getPresetRange } from '../lib/dateRange'
import type { Preset } from '../lib/dateRange'
import { pageVariants, pageTransition } from '../animations/pageVariants'

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
        <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-[calc(100dvh-80px)] flex items-start justify-center pt-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100"
        >
            <motion.article
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 }}
                className="w-full max-w-3xl space-y-8 rounded-2xl bg-gray-900/80 backdrop-blur border border-gray-800 p-6 sm:p-8 shadow-lg"
            >
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center bg-gray-800/60 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">{t('usage.filter.range')}</label>
                        <select
                            value={preset}
                            onChange={e => handlePreset(e.target.value as Preset | 'custom')}
                            className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-100 outline-none"
                        >
                            <option value="today">{t('usage.filter.today')}</option>
                            <option value="7d">{t('usage.filter.7d')}</option>
                            <option value="30d">{t('usage.filter.30d')}</option>
                            <option value="custom">{t('usage.filter.custom')}</option>
                        </select>
                    </div>
                    {preset === 'custom' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={e => handleCustomChange(e.target.value, customTo)}
                                className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-100 outline-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={customTo}
                                onChange={e => handleCustomChange(customFrom, e.target.value)}
                                className="bg-gray-900/70 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-100 outline-none"
                            />
                        </div>
                    )}
                </header>

                {error && <p className="text-center text-red-400">{error}</p>}
                {loading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                )}

                {summary && !loading && (
                    <div className="space-y-8">
                        <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-6 text-center shadow-md">
                            <h2 className="text-xl font-bold mb-2">{t('usage.total')}</h2>
                            <p className="text-3xl font-extrabold">{summary.total_links ?? 0}</p>
                        </div>

                        <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-6 shadow-md">
                            <h2 className="text-xl font-bold mb-4">{t('usage.top')}</h2>
                            <ul className="space-y-2">
                                {(summary.top_links ?? []).map(l => (
                                    <li
                                        key={l.id}
                                        className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 hover:border-indigo-500 transition"
                                    >
                                        <a
                                            href={l.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="truncate hover:underline text-indigo-300"
                                        >
                                            {l.title}
                                        </a>
                                        <span className="text-sm text-gray-400">{l.open_count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-6 shadow-md">
                            <h2 className="text-xl font-bold mb-4">{t('usage.never')}</h2>
                            <ul className="space-y-2">
                                {(summary.never_opened ?? []).map(l => (
                                    <li
                                        key={l.id}
                                        className="bg-gray-900/50 border border-gray-700 rounded-xl hover:border-indigo-500 transition"
                                    >
                                        <LinkCard
                                            link={{ id: l.id, url: l.url, title: l.title }}
                                            onOpen={() => handleOpened(l.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </motion.article>
        </motion.section>
    )
}

export default UsagePage
