import { render } from '../utils/render'
import { Layout } from '../components/layout'
import { routes } from '../../routes'
import { Channels } from '../assets/channels'
import { getChannels } from '../store/sse'

export let home = () => {
  let channels = getChannels().map((c) => c.name)
  let eventScript = String.raw`
      let es = new EventSource('${routes.chat.events.href()}');
      let source = document.getElementById('event-source');
      console.log(source);
      es.addEventListener('join', (event) => {
        let evt = new CustomEvent('join', {detail: JSON.parse(event.data)});
        source.dispatchEvent(evt);
      });
      es.addEventListener('newChannel', (event) => {
        let evt = new CustomEvent('newChannel', {detail: JSON.parse(event.data)});
        source.dispatchEvent(evt);
      });
      es.addEventListener('message', (event) => { 
      });
      es.onerror = (event) => {
        es.close()
      }
  `
  return render(
    <Layout>
      <h1>Home</h1>
      <source id="event-source" innerHTML={eventScript}></source>
      <script innerHTML={eventScript}></script>
      <a href={routes.logout.href()}>Logout</a>
      <Channels channels={channels}></Channels>
    </Layout>,
  )
}
