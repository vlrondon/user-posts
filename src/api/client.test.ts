import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { API } from '../test/fixtures'
import { server } from '../test/server'
import { ApiError, apiFetch } from './client'

const schema = z.object({ id: z.number() })

describe('apiFetch', () => {
  it('devuelve los datos validados cuando la respuesta es correcta', async () => {
    server.use(http.get(`${API}/thing`, () => HttpResponse.json({ id: 7, extra: 'ignorado' })))

    await expect(apiFetch('/thing', schema)).resolves.toEqual({ id: 7 })
  })

  it('lanza ApiError con el status cuando el servidor falla', async () => {
    server.use(http.get(`${API}/thing`, () => new HttpResponse(null, { status: 500 })))

    const error = await apiFetch('/thing', schema).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(500)
  })

  it('lanza ApiError cuando la respuesta no cumple el esquema', async () => {
    server.use(http.get(`${API}/thing`, () => HttpResponse.json({ id: 'no-es-un-numero' })))

    await expect(apiFetch('/thing', schema)).rejects.toBeInstanceOf(ApiError)
  })
})
