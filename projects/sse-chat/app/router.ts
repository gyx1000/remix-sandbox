import { createRouter } from '@remix-run/fetch-router'
import { routes } from '../routes'
import { home } from './routes/home'
import { chat } from './routes/chat'
import { auth, logout } from './routes/auth'
import { createCookie } from '@remix-run/cookie'
import { createCookieSessionStorage } from '@remix-run/session/cookie-storage'
import { session } from '@remix-run/session-middleware'
import { createRedirectResponse } from '@remix-run/response/redirect'
import { formData } from '@remix-run/form-data-middleware'

let sessionCookie = createCookie('__gyx_s', {
  secrets: ['s3cr3t'],
  secure: true,
})

let sessionStorage = createCookieSessionStorage()

export let router = createRouter({
  middleware: [
    formData(),
    session(sessionCookie, sessionStorage),
    ({ session, url }) => {
      // ensure uuid
      if (!session.has('uuid') && url.pathname !== routes.auth.index.href()) {
        return createRedirectResponse(routes.auth.index.href())
      }
    },
  ],
})

router.get(routes.home, home)
router.map(routes.chat, chat)
router.map(routes.auth, auth)
router.get(routes.logout, logout)
