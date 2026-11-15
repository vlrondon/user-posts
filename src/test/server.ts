import { setupServer } from 'msw/node'

/**
 * Servidor MSW compartido por los tests. Arranca sin handlers: cada test
 * declara las respuestas que necesita, así se lee de un vistazo qué red simula.
 */
export const server = setupServer()
