import { html, type SafeHtml } from '@remix-run/html-template'

export let document = (children: SafeHtml) => {
  return html`
    <html>
      <head></head>
      <body>
        ${children}
      </body>
    </html>
  `
}
