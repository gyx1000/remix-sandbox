import { Document } from './document'
import type { Remix } from '@remix-run/dom'

export function Layout({ children }: { children: Remix.RemixNode }) {
  return (
    <Document>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </Document>
  )
}
