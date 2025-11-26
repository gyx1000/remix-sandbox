import { createSseChannel } from '@gyx1000/remix-sse'
import type { SseSession } from '@gyx1000/remix-sse'

let eventIdSeqence = 1
// TODO: sessions should be a Record<string, WeakRef<SseSession>[]>
// because an use can open multiple tabs with the same cookie
export let sessions: Record<string, WeakRef<SseSession>> = {}
export let globalChannel = createSseChannel()

export let channels = [
  {
    name: 'Global',
    slug: 'global',
  },
]

export let getChannels = () => {
  return channels
}

export let nextEventId = () => {
  return (eventIdSeqence++).toString()
}
