import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { API, postsOfLeanne, users } from '../../test/fixtures'
import { renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

describe('Formulario de nueva publicación', () => {
  beforeEach(() => {
    server.use(
      http.get(`${API}/users`, () => HttpResponse.json(users)),
      http.get(`${API}/posts`, () => HttpResponse.json(postsOfLeanne)),
    )
  })

  it('no envía nada y muestra los errores si título y texto están vacíos', async () => {
    let postRequests = 0
    server.use(
      http.post(`${API}/posts`, () => {
        postRequests += 1
        return HttpResponse.json({}, { status: 201 })
      }),
    )

    const { user } = renderApp('/users/1')
    await user.click(await screen.findByRole('button', { name: 'Publicar' }))

    const title = screen.getByRole('textbox', { name: 'Título' })
    const body = screen.getByRole('textbox', { name: 'Texto' })
    expect(title).toBeInvalid()
    expect(title).toHaveAccessibleDescription('El título es obligatorio.')
    expect(body).toBeInvalid()
    expect(body).toHaveAccessibleDescription('El texto es obligatorio.')
    expect(postRequests).toBe(0)
  })

  it('añade la publicación creada al principio de la lista y limpia el formulario', async () => {
    let sentBody: unknown
    server.use(
      http.post(`${API}/posts`, async ({ request }) => {
        sentBody = await request.json()
        // Igual que la API real: devuelve lo enviado con id 101.
        return HttpResponse.json({ ...(sentBody as object), id: 101 }, { status: 201 })
      }),
    )

    const { user } = renderApp('/users/1')
    const title = await screen.findByRole('textbox', { name: 'Título' })
    const body = screen.getByRole('textbox', { name: 'Texto' })

    await user.type(title, 'Mi publicación')
    await user.type(body, 'Contenido de prueba')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    const list = screen.getByRole('list', { name: 'Publicaciones' })
    expect(await within(list).findByText('Mi publicación')).toBeInTheDocument()

    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('Mi publicación')
    expect(items[0]).toHaveTextContent('Contenido de prueba')
    expect(sentBody).toEqual({ userId: 1, title: 'Mi publicación', body: 'Contenido de prueba' })
    expect(title).toHaveValue('')
    expect(body).toHaveValue('')
  })

  it('permite crear dos publicaciones seguidas aunque la API repita el id', async () => {
    server.use(
      http.post(`${API}/posts`, async ({ request }) =>
        HttpResponse.json({ ...((await request.json()) as object), id: 101 }, { status: 201 }),
      ),
    )

    const { user } = renderApp('/users/1')
    const title = await screen.findByRole('textbox', { name: 'Título' })
    const body = screen.getByRole('textbox', { name: 'Texto' })
    const list = screen.getByRole('list', { name: 'Publicaciones' })

    for (const name of ['Primera nueva', 'Segunda nueva']) {
      await user.type(title, name)
      await user.type(body, 'Texto')
      await user.click(screen.getByRole('button', { name: 'Publicar' }))
      await within(list).findByText(name)
    }

    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items[0]).toHaveTextContent('Segunda nueva')
    expect(items[1]).toHaveTextContent('Primera nueva')
  })

  it('muestra el error y conserva lo escrito si el servidor rechaza el alta', async () => {
    server.use(http.post(`${API}/posts`, () => new HttpResponse(null, { status: 500 })))

    const { user } = renderApp('/users/1')
    const title = await screen.findByRole('textbox', { name: 'Título' })

    await user.type(title, 'No se guardará')
    await user.type(screen.getByRole('textbox', { name: 'Texto' }), 'Texto')
    await user.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo crear la publicación.')
    expect(title).toHaveValue('No se guardará')
    expect(within(screen.getByRole('list', { name: 'Publicaciones' })).getAllByRole('listitem')).toHaveLength(2)
  })
})
