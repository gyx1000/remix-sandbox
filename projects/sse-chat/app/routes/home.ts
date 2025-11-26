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
      <iframe src="/chat/global/post"></iframe>

      <script>
        let channelsListFrame = document.getElementById('channels_list')
        let es = new EventSource('${routes.chat.events.href()}')

        es.addEventListener('new_channel', (event) => {
          channelsListFrame.contentWindow.postMessage({
            type: 'CHANNEL_ADDED',
          })
        })
      </script>
    `),
  )
}
