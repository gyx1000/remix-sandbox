import { html, type SafeHtml } from '@remix-run/html-template'

export let layout = (children: SafeHtml) => {
  return html`<header></header>
    <main>${children}</main>
    <footer></footer>`
}
