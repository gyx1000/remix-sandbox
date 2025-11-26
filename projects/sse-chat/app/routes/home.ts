import { html } from '@remix-run/html-template'
import { render } from '../utils/render'
import { layout } from '../components/layout'
import { routes } from '../../routes'

export let home = () => {
  return render(
    layout(html`
      <h1>Home</h1>
      <a href="${routes.logout.href()}">Logout</a>
      <iframe id="channels_list" src="${routes.chat.list.href()}"></iframe>
      <iframe id="channel" src="/chat/global/messages"></iframe>
      <script>
        let channelsListFrame = document.getElementById('channels_list')
        let channelFrame = document.getElementById('channel')

        let es = new EventSource('${routes.chat.events.href()}')

        window.addEventListener('message', (event) => {
          let { type, slug } = event.data ?? {}
          if (type === 'CHANGE_CHANNEL') {
            channelFrame.src = '/chat/' + slug + '/messages'
          }
        })

        es.addEventListener('new_channel', (event) => {
          channelsListFrame.contentWindow.postMessage({
            type: 'CHANNEL_ADDED',
          })
        })
        es.addEventListener('message', (event) => {
          let { channel, nickName, message, date } = JSON.parse(event.data ?? {})
          console.log('New chat message', channel, message)
        })
      </script>
    `),
  )
}
