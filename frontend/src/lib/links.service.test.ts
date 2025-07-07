import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { getLinks } from './links.service'

describe('getLinks', () => {
    it('returns links from API', async () => {
        server.use(
            http.get('https://test.supabase.co/rest/v1/links', () => {
                return HttpResponse.json({
                    id: '1',
                    user_id: '1',
                    url: 'https://example.com',
                    title: 'Example',
                    description: null,
                    category_id: null,
                    tags: null,
                    favorite: false,
                    created_at: '2024-01-01'
                })
            })
        )

        const { data } = await getLinks()
        expect(data?.[0].url).toBe('https://example.com')
    })
})