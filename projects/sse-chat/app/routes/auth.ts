import type { RouteHandlers } from '@remix-run/fetch-router'
import type { routes } from '../../routes'

export let auth = {
  index: () => {
    return new Response('auth index')
  },
  action: () => {
    return new Response('auth post')
  },
} satisfies RouteHandlers<typeof routes.auth>
