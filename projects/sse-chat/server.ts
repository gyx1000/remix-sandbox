import { createServer } from 'http'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { router } from './app/router'

let PORT = 3000

let server = createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.log(error)
      return new Response(`internal server error`, {
        status: 500,
      })
    }
  }),
)

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
