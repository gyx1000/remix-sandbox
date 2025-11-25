import type { RouteHandlers } from '@remix-run/fetch-router'
import type { routes } from '../../routes'

export let chat = {
  middleware: [],
  handlers: {
    slug: {
      handlers: {
        index: () => {
          return new Response('chat home')
        },
        post: () => {
          return new Response('chat post')
        },
        register: () => {
          return new Response('chat register')
        },
        unregister: () => {
          return new Response('chat unregister')
        },
      },
    },
    create: () => {
      return new Response('channel create')
    },
    list: () => {
      return new Response('chat list')
    },
  },
} satisfies RouteHandlers<typeof routes.chat>
