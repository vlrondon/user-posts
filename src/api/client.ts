import type { z } from 'zod'
import { API_BASE_URL } from './config'

/**
 * Error de la capa de datos. Distingue el fallo HTTP (con `status`) del fallo
 * de red o de una respuesta con forma inesperada (sin `status`).
 */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Único punto de salida hacia la API: los componentes nunca llaman a `fetch`.
 * La respuesta se valida con un esquema Zod, de modo que el tipo devuelto está
 * comprobado en tiempo de ejecución y no solo declarado.
 */
export async function apiFetch<Schema extends z.ZodType>(
  path: string,
  schema: Schema,
  init?: RequestInit,
): Promise<z.infer<Schema>> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.')
  }

  if (!response.ok) {
    throw new ApiError(`El servidor respondió con un error (${response.status}).`, response.status)
  }

  const parsed = schema.safeParse(await response.json())
  if (!parsed.success) {
    throw new ApiError('La respuesta del servidor no tiene el formato esperado.')
  }
  return parsed.data
}
