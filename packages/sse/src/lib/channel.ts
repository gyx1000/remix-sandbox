import type { SseEvent } from './event'
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

export class SseChannel extends TypedEventTarget<SseChannelEventMap> {
  #sessions: Set<SseSession>

  constructor() {
    super()
    this.#sessions = new Set()
  }

  broadcast(event: SseEvent) {
    for (let session of this.#sessions) {
      if (!session.isConnected) continue
      session.send(event)
    }
  }

  get count() {
    return this.#sessions.size
  }

  register(session: SseSession) {
    if (this.#sessions.has(session)) return
    this.#sessions.add(session)
    let dispose = on(session, {
      disconnected: {
        once: true,
        listener: () => {
          dispose()
          this.unregister(session)
        },
      },
    })

    this.dispatchEvent(new SseChannelEvent('register', session))
  }

  unregister(session: SseSession) {
    if (!this.#sessions.has(session)) return
    this.#sessions.delete(session)
    this.dispatchEvent(new SseChannelEvent('unregister', session))
  }
}

export let createSseChannel = () => {
  return new SseChannel()
}
