import { hydrated } from '@remix-run/dom'
import { routes } from '../../routes'
import { on, type Dispatched } from '@remix-run/interaction'
import { Channels } from './channels'

export let Messages = hydrated(
  routes.assets.href({ path: 'messages.js#Messages' }),
  function (this) {
    this.queueTask(() => {
      let es = new EventSource(routes.chat.events.href())
      let dispose = on(es, {
        open: () => this.update(),
        error: () => {
          ;(this.update(), es.close())
        },
        message: (event) => {
          console.log(event)
        },
        join: (event: Dispatched<MessageEvent<any>, EventSource>) => {
          console.log(event)
          this.update()
        },
        newChannel: (event: Dispatched<MessageEvent<any>, EventSource>) => {
          let data = JSON.parse(event.data)
          this.update()
        },
      })
      this.signal.addEventListener('abort', () => {
        es.close()
        dispose()
      })
    })
    return () => <div id="messages"></div>
  },
)
