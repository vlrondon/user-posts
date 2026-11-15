import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API, users } from '../../test/fixtures'
import { renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

describe('Lista de usuarios', () => {
  it('muestra el estado de carga y después los usuarios', async () => {
    server.use(http.get(`${API}/users`, () => HttpResponse.json(users)))

    renderApp()

    expect(screen.getByRole('status')).toHaveTextContent('Cargando usuarios')
    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('muestra el error cuando la API falla y permite reintentar', async () => {
    let calls = 0
    server.use(
      http.get(`${API}/users`, () => {
        calls += 1
        return calls === 1 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(users)
      }),
    )

    const { user } = renderApp()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No se pudieron cargar los usuarios.')

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
