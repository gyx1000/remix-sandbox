import type { SseSession } from './session'
import { on, TypedEventTarget } from '@remix-run/interaction'

interface SseChannelEventMap {
  register: SseChannelEvent
  unregister: SseChannelEvent
}

class SseChannelEvent extends Event {
  session: SseSession
  constructor(type: SseChannelEvent['type'], session: SseSession) {
    super(type)
    this.session = session
  }
}

export let createSseChannel = () => {
  let sessions = new Set<SseSession>()
  let events = new TypedEventTarget<SseChannelEventMap>()

  return Object.assign(events, {
    register: (session: SseSession) => {
      let cleanup = () => {
        dispose()
        sessions.delete(session)
        events.dispatchEvent(new SseChannelEvent('unregister', session))
      }

      if (sessions.has(session)) {
        console.log(`Already registered`)
        return
      }
      sessions.add(session)
      events.dispatchEvent(new SseChannelEvent('register', session))
      let dispose = on(session, {
        disconnected: {
          once: true,
          listener: cleanup,
        },
      })
    },
    broadcast: (event: string, data: string, id: string = crypto.randomUUID()) => {
      for (let session of sessions) {
        if (!session.connected) continue
        session.push(event, data, id)
      }
    },
    get count() {
      return sessions.size
    },
  })
}
