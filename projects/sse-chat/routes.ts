import { formAction, route } from '@remix-run/fetch-router'

export let routes = route({
  home: { method: 'GET', pattern: '/' },
  auth: formAction('/auth'),
  chat: route('/chat', {
    slug: route('/:slug', {
      messages: '/messages',
      post: formAction('/post'),
      register: { method: 'POST', pattern: '/register' },
      unregister: { method: 'POST', pattern: '/unregister' },
    }),
    events: { method: 'GET', pattern: '/events' },
    create: formAction('/create'),
    list: { method: 'GET', pattern: '/list' },
  }),
  logout: '/logout',
})
