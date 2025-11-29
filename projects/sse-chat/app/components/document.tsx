import type { Remix } from '@remix-run/dom'
import { routes } from '../../routes'

export function Document({ children }: { children: Remix.RemixNode }) {
  return (
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <script type="module" src={routes.assets.href({ path: `entry.js` })}></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
