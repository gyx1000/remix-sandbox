import { formAction, route } from '@remix-run/fetch-router'

export let routes = route({
  home: { method: 'GET', pattern: '/' },
  auth: formAction('/auth'),
  chat: route('/chat', {
    slug: route('/:slug', {
      index: { method: 'GET', pattern: '/' },
      post: { method: 'POST', pattern: '/post' },
      register: { method: 'POST', pattern: '/register' },
      unregister: { method: 'POST', pattern: '/unregister' },
    }),
    create: '/create',
    list: { method: 'GET', pattern: '/list' },
  }),
})
