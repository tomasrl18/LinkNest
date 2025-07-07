import { describe, it, expect, vi } from 'vitest'
import { getLinks } from './links.service'

vi.mock('../lib/supabase', () => {
    return {
        supabase: {
            from: () => ({
                select: () => ({
                    order: () => ({
                        data: [
                            {
                                id: '1',
                                url: 'https://example.com',
                                title: 'Example',
                                favorite: false,
                                created_at: '2024-01-01',
                                categories: {
                                    id: '1',
                                    name: 'Test'
                                }
                            }
                        ],
                        error: null,
                    }),
                }),
            }),
        },
    }
})

describe('getLinks', () => {
    it('returns links from API', async () => {
        const { data } = await getLinks()
        expect(data?.[0].url).toBe('https://example.com')
    })
})