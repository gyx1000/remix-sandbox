import { html, type SafeHtml } from '@remix-run/html-template'

export let document = (children: SafeHtml) => {
  return html`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </head>
      <body>
        ${children}
      </body>
    </html>
  `
}
