import { useQuery } from '@tanstack/react-query'
import { fetchPostsByUser } from './posts.api'

/** Clave de caché de las publicaciones de un usuario, compartida por lectura y escritura. */
export const postsQueryKey = (userId: number) => ['posts', userId] as const

export function usePosts(userId: number) {
  return useQuery({
    queryKey: postsQueryKey(userId),
    queryFn: () => fetchPostsByUser(userId),
    // La API no persiste las publicaciones creadas: solo viven en esta caché.
    // Si la lista se volviera a pedir en segundo plano, desaparecerían.
    staleTime: Infinity,
  })
}
