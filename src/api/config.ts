const DEFAULT_API_BASE_URL = 'https://jsonplaceholder.typicode.com'

const configured = import.meta.env.VITE_API_BASE_URL?.trim()

/**
 * URL base de la API. Se configura con la variable de entorno
 * `VITE_API_BASE_URL` (ver `.env.example`); si no está definida se usa la API
 * pública de JSONPlaceholder, de modo que el proyecto arranca sin configurar
 * nada. Se quita la barra final para que `${API_BASE_URL}/users` no la duplique.
 */
export const API_BASE_URL = (configured || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
