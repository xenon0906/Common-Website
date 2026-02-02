import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/blogs', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Blog',
        slug: 'test-blog',
        excerpt: 'Test excerpt',
        content: 'Test content',
        imageUrl: null,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }),

  http.get('/api/achievements', () => {
    return HttpResponse.json([
      {
        id: '1',
        type: 'award',
        title: 'Test Achievement',
        content: 'Test content',
      },
    ])
  }),

  http.get('/api/admin/settings', () => {
    return HttpResponse.json({
      site: { name: 'Snapgo', tagline: 'Test' },
      contact: { email: 'test@test.com' },
    })
  }),
]
