import { html } from '@remix-run/html-template'
import { render } from '../utils/render'
import { layout } from '../components/layout'
import { routes } from '../../routes'

export let home = () => {
  return render(
    layout(html`
      <h1>Home</h1>
      <a href="${routes.logout.href()}">Logout</a>
    `),
  )
}
