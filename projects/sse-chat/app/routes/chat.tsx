import type { RouteHandlers } from '@remix-run/fetch-router'
import type { routes } from '../../routes'
import { createSseSession, SseEvent } from '@gyx1000/remix-sse'
import { globalChannel, nextEventId, sessions } from '../store/sse'
import { slugify } from '../utils/slug'
import { getChannels } from '../store/sse'

export let chat = {
  middleware: [],
  handlers: {
    slug: {
      handlers: {
        messages: ({ params }) => {
          return new Response()
        },
        post: {
          index: () => {
            return new Response()
          },
          action: ({ params, session, formData }) => {
            // TODO: validate formData message
            let slug = params.slug

            if (slug === 'global') {
              let messageEvent = new SseEvent().id(nextEventId()).data(
                JSON.stringify({
                  channel: 'global',
                  nickName: session.get('nickName'),
                  message: formData.get('message') as string,
                  date: new Date(),
                }),
              )

              globalChannel.broadcast(messageEvent)
            } else {
              // TODO: register user to this channel
            }

            return new Response(null, { status: 204 })
          },
        },
        register: () => {
          return new Response('chat register')
        },
        unregister: () => {
          return new Response('chat unregister')
        },
      },
    },
    events: ({ request, session }) => {
      let sseSession = createSseSession(request, {
        keepAlive: 10_000,
        padding: true,
        preamble: true,
        retry: 2_000,
      })

      // store the session in registry
      sessions[session.get('uuid') as string] = new WeakRef(sseSession)

      // every user are connected to the global channel
      globalChannel.register(sseSession)

      let headers = new Headers()

      headers.set('Content-Type', 'text/event-stream')
      headers.set('Cache-Control', 'no-cache')
      headers.set('Connection', 'keep-alive')

      return new Response(sseSession.stream, { headers })
    },
    create: {
      index: () => {
        return new Response()
      },
      action: ({ formData }) => {
        let channelName = (formData.get('channel_name') as string) ?? ''
        let channelSlug = slugify(channelName)

        // TODO: Validate channel_name value ! Already exists, empty, etc...
        // XSS is protected with remix html``
        let channels = getChannels()
        channels.push({
          slug: channelSlug,
          name: channelName,
        })

        let newChannelEvent = new SseEvent('newChannel')
          .data(
            JSON.stringify({
              channel: channelSlug,
              date: new Date(),
            }),
          )
          .id(nextEventId())
        globalChannel.broadcast(newChannelEvent)

        return new Response(null, { status: 204 })
      },
    },
    list: () => {
      return new Response()
    },
  },
} satisfies RouteHandlers<typeof routes.chat>
