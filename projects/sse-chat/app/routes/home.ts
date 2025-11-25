import { html } from '@remix-run/html-template'
import { render } from '../utils/render'
import { layout } from '../components/layout'

export let home = () => {
  return render(layout(html` <h1>Home</h1> `))
}
