import { TypedEventTarget } from '@remix-run/interaction'
import type { SseEvent } from './event'

interface SseSessionEventMap {
  disconnected: SseSessionEvent
  connected: SseSessionEvent
}

class SseSessionEvent extends Event {
  constructor(type: SseSessionEvent['type']) {
    super(type)
  }
}

export interface SseSessionOptions {
  padding?: boolean
  preamble?: boolean
  keepAlive?: number
  retry?: number
}

export class SseSession extends TypedEventTarget<SseSessionEventMap> {
  #signal: AbortSignal
  #stream: ReadableStream
  #writer: WritableStreamDefaultWriter
  #connected: boolean
  #lastEventId: string | null
  #keepAliveInterval: ReturnType<typeof setInterval> | null
  #options: SseSessionOptions
  #encoder: TextEncoder

  constructor(request: Request, options: SseSessionOptions = {}) {
    super()
    this.#options = options
    let { readable, writable } = new TransformStream()
    this.#writer = writable.getWriter()
    this.#stream = readable
    this.#connected = false
    this.#signal = request.signal
    this.#lastEventId = request.headers.get('last-event-id')
    this.#keepAliveInterval = null
    this.#encoder = new TextEncoder()
    this.#signal.addEventListener('abort', this.disconnect.bind(this), { once: true })
  }

  #write(data: string): void {
    if (!this.isConnected) throw new Error(`Could not write on disconnected session`)
    this.#writer.write(this.#encoder.encode(`${data}\n`))
  }

  #flush(): void {
    this.#write('')
  }

  #init(): void {
    if (this.#options.padding == true) {
      let padding = ' '.repeat(2049)
      this.comment(padding)
    }
    if (this.#options.preamble == true) {
      let preamble = ' '.repeat(2056)
      this.comment(preamble)
    }
    if (this.#options.retry) {
      this.#write(`retry:${this.#options.retry}`)
      this.#flush()
    }
    if (this.#options.keepAlive) {
      this.#keepAliveInterval = setInterval(() => {
        this.comment()
      }, this.#options.keepAlive)
    }
  }

  send(event: SseEvent) {
    for (let line of event.build()) {
      this.#write(line)
    }
    this.#flush()
  }

  comment(comment: string = '') {
    this.#write(`: ${comment}`)
    this.#flush()
  }

  disconnect() {
    if (this.#keepAliveInterval) {
      clearInterval(this.#keepAliveInterval)
    }
    this.#signal.removeEventListener('abort', this.disconnect)
    this.#writer.close()
    this.dispatchEvent(new SseSessionEvent('disconnected'))
  }

  get stream(): ReadableStream {
    this.#connected = true
    this.#init()
    this.dispatchEvent(new SseSessionEvent('connected'))
    return this.#stream
  }

  get isConnected(): boolean {
    return this.#connected
  }

  get lastEventId(): string | null {
    return this.#lastEventId
  }
}

export function createSseSession(request: Request, options: SseSessionOptions = {}) {
  return new SseSession(request, options)
}
