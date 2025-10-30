import { describe, it, expect, vi } from 'vitest'
import { getThreads, getThreadWithLinks } from './threads.service'

vi.mock('../lib/supabase', () => {
    return {
        supabase: {
            from: (table: string) => ({
                select: (_sel?: string) => ({
                    order: () => ({
                        data: table === 'threads' ? [
                            {
                                id: 't1',
                                title: 'Aprender Next.js',
                                description: 'Artículos, vídeos y repos',
                                tags: ['nextjs', 'react'],
                                user_id: 'u1',
                                created_at: '2024-01-01',
                            },
                        ] : [],
                        error: null,
                    }),
                    eq: (_col: string, _id: string) => ({
                        single: () => ({
                            data: {
                                id: 't1',
                                title: 'Aprender Next.js',
                                description: 'Artículos, vídeos y repos',
                                tags: ['nextjs', 'react'],
                                user_id: 'u1',
                                created_at: '2024-01-01',
                                thread_links: [
                                    {
                                        id: 'tl1',
                                        thread_id: 't1',
                                        link_id: 'l1',
                                        position: 1,
                                        note: null,
                                        created_at: '2024-01-02',
                                        links: {
                                            id: 'l1', url: 'https://example.com', title: 'Example', description: null,
                                            category_id: null, tags: null, favorite: false, user_id: 'u1', created_at: '2024-01-01'
                                        }
                                    }
                                ]
                            },
                            error: null,
                        })
                    })
                })
            })
        }
    }
})

describe('threads.service', () => {
    it('returns threads from API', async () => {
        const { data } = await getThreads()
        expect(data?.[0].title).toBe('Aprender Next.js')
    })

    it('returns a thread with links', async () => {
        const { data } = await getThreadWithLinks('t1')
        expect(data?.thread_links?.[0]?.links?.url).toBe('https://example.com')
    })
})

