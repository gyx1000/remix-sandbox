import { hydrated } from '@remix-run/dom'
import { routes } from '../../routes'
import { dom } from '@remix-run/events'

export const Channels = hydrated(
  routes.assets.href({ path: `channels.js#Channels` }),
  function (this, { channels }: { channels: string[] }) {
    this.queueTask(() => {
      let source = document.getElementById('event-source')
      source?.addEventListener('newChannel', (event) => {
        let { channel } = event.detail
        channels.push(channel)
        this.update()
      })
    })

    return () => (
      <div>
        <h2>Channels</h2>
        <form
          method="POST"
          action={routes.chat.create.action.href()}
          on={dom.submit(async (event, signal) => {
            event.preventDefault()
            let form = event.currentTarget
            let data = new FormData(form)
            await fetch(event.currentTarget.action, {
              method: event.currentTarget.method,
              body: data,
              signal,
            })
            form.reset()
            this.update()
          })}
        >
          <input type="text" name="channel_name" />
          <button type="submit">Add</button>
        </form>
        <ul>
          {channels.map((channel) => (
            <li>{channel}</li>
          ))}
        </ul>
      </div>
    )
  },
)
