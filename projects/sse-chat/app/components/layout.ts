import { html, type SafeHtml } from '@remix-run/html-template'
import { document } from './document'

export let layout = (children: SafeHtml) => {
  return document(
    html`<header></header>
      <main>${children}</main>
      <footer></footer>`,
  )
}
