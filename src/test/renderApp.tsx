import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

/**
 * Monta la app completa como lo hace `main.tsx`, con un QueryClient nuevo por
 * test (sin caché compartida) y sin reintentos, para que los errores aparezcan
 * de inmediato.
 */
export function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    ),
  }
}
