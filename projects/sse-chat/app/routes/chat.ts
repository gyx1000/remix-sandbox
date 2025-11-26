import type { RouteHandlers } from '@remix-run/fetch-router'
import type { routes } from '../../routes'
import { createSseSession } from '@gyx1000/remix-sse'
import { globalChannel, nextEventId, sessions } from '../store/sse'
import { html } from '@remix-run/html-template'
import { render } from '../utils/render'
import { slugify } from '../utils/slug'
import { getChannels } from '../store/sse'

let postView = () => {
  return html`
    <form method="POST">
      <input type="text" name="message" />
      <button type="submit" name="_post">send</button>
    </form>
  `
}

let addChannelView = () => {
  return html`
    Add a channel
    <form method="POST">
      <input type="text" name="channel_name" />
      <button type="submit" name="_add">add</button>
    </form>
  `
}

let channelsListView = () => {
  return html`
    <h2>Channels</h2>
    <iframe src="/chat/create"></iframe>
    <ul>
      ${getChannels().map(
        (c) =>
          html`<li>
            <a href="/chat/${c.slug}/messages" target="channel_messages">${c.name}</a>
          </li>`,
      )}
    </ul>
  `
}

export let chat = {
  middleware: [],
  handlers: {
    slug: {
      handlers: {
        messages: ({ params }) => {
          return render(html`
            <h2>Messages of ${params.slug}</h2>
            <div></div>
            <iframe src="./post"></iframe>
          `)
        },
        post: {
          index: () => {
            return render(postView())
          },
          action: ({ params, session, formData }) => {
            // TODO: validate formData message
            let slug = params.slug
            if (slug === 'global') {
              globalChannel.broadcast(
                'message',
                JSON.stringify({
                  channel: 'global',
                  nickName: session.get('nickName'),
                  message: html`${formData.get('message') as string}`,
                  date: new Date(),
                }),
                nextEventId(),
              )
            } else {
              // TODO: register user to this channel
            }

            return render(postView())
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
        return render(addChannelView())
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

        // TODO: filter out current user, otherwhise, the client will refresh two times
        globalChannel.broadcast(
          'new_channel',
          JSON.stringify({
            channel: channelSlug,
            date: new Date(),
          }),
          nextEventId(),
        )

        return render(addChannelView())
      },
    },
    list: () => {
      return render(channelsListView())
    },
  },
} satisfies RouteHandlers<typeof routes.chat>
