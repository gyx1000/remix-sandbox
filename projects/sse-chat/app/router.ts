import { createRouter } from '@remix-run/fetch-router'
import { routes } from '../routes'
import { home } from './routes/home'
import { chat } from './routes/chat'
import { auth } from './routes/auth'

export let router = createRouter()

router.get(routes.home, home)
router.map(routes.chat, chat)
router.map(routes.auth, auth)
