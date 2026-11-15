import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Un solo reintento: suficiente para un fallo puntual de red sin
        // retrasar varios segundos la aparición del estado de error.
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
