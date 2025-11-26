import type { BuildRouteHandler, RouteHandlers } from '@remix-run/fetch-router'
import { routes } from '../../routes'
import { render } from '../utils/render'
import { layout } from '../components/layout'
import { html } from '@remix-run/html-template'
import { defaultDict } from '../utils/data'
import { createRedirectResponse } from '@remix-run/response/redirect'
import type { FieldError, FormError, FormInitial } from '../utils/form'
import { globalChannel, nextEventId } from '../store/sse'

let view = (
  initial: FormInitial = defaultDict<string>(() => ''),
  errors: FormError = defaultDict<FieldError[]>(() => []),
) => {
  return render(
    layout(html`
      <h1>Choose your nickname</h1>
      <form method="POST">
        <label>Nickname</label
        ><input type="text" name="nick_name" value="${initial?.nick_name}" /><br />
        <b>${errors?.nick_name.map((e) => e.message).join(',')}</b>
        <button type="submit" name="_set_nickname">Save</button>
      </form>
    `),
  )
}

export let logout: BuildRouteHandler<'GET', typeof routes.logout> = ({ session }) => {
  session.destroy()
  return createRedirectResponse(routes.auth.index.href())
}

export let auth = {
  index: () => {
    return view()
  },
  action: ({ formData, session }) => {
    let nickName = ((formData.get('nick_name') ?? '') as string).trim()
    let errors: FormError = defaultDict<FieldError[]>(() => [])
    let initial: FormInitial = defaultDict<string>(() => '')

    initial.nick_name = nickName

    if (nickName == '') {
      errors['nick_name'].push({ message: `Could not be empty` })
    }

    if (Object.keys(errors).length == 0) {
      session.set('nickName', nickName)
      session.set('uuid', crypto.randomUUID())
      // inform every session that a new user joined
      globalChannel.broadcast(
        'join',
        JSON.stringify({ nickName: session.get('nickName') }),
        nextEventId(),
      )
      return createRedirectResponse(routes.home.href())
    }

    return view(initial, errors)
  },
} satisfies RouteHandlers<typeof routes.auth>
