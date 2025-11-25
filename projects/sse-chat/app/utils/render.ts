import type { SafeHtml } from '@remix-run/html-template'
import { createHtmlResponse } from '@remix-run/response/html'

export let render = (content: SafeHtml) => {
  return createHtmlResponse(content)
}
