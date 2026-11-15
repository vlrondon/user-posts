import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { API, postsOfLeanne, users } from '../../test/fixtures'
import { renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

describe('Publicaciones de un usuario', () => {
  beforeEach(() => {
    server.use(http.get(`${API}/users`, () => HttpResponse.json(users)))
  })

  it('al elegir un usuario muestra solo sus publicaciones', async () => {
    let requestedUserId: string | null = null
    server.use(
      http.get(`${API}/posts`, ({ request }) => {
        requestedUserId = new URL(request.url).searchParams.get('userId')
        return HttpResponse.json(postsOfLeanne)
      }),
    )

    const { user } = renderApp()
    expect(screen.getByText(/Elige un usuario/)).toBeInTheDocument()

    await user.click(await screen.findByRole('link', { name: /Leanne Graham/ }))

    const list = await screen.findByRole('list', { name: 'Publicaciones' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Publicaciones de Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Leanne Graham/ })).toHaveAttribute('aria-current', 'page')
    expect(requestedUserId).toBe('1')
  })

  it('muestra el error si fallan las publicaciones, sin afectar a la lista de usuarios', async () => {
    server.use(http.get(`${API}/posts`, () => new HttpResponse(null, { status: 503 })))

    renderApp('/users/1')

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar las publicaciones.')
    expect(await screen.findByRole('link', { name: /Leanne Graham/ })).toBeInTheDocument()
  })

  it('avisa si la dirección no corresponde a un usuario', async () => {
    renderApp('/users/abc')

    expect(await screen.findByText(/no corresponde a ningún usuario/)).toBeInTheDocument()
  })
})
