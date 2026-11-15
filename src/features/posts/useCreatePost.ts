import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nextLocalId } from './localPosts'
import type { NewPostValues } from './newPost.schema'
import type { Post } from './post.schema'
import { createPost } from './posts.api'
import { postsQueryKey } from './usePosts'

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: NewPostValues) => createPost(userId, values),
    // Se espera a la respuesta del servidor (sin actualización optimista) y
    // entonces se añade la publicación al principio de la lista en caché.
    onSuccess: (created) => {
      queryClient.setQueryData<Post[]>(postsQueryKey(userId), (current = []) => [
        { ...created, id: nextLocalId() },
        ...current,
      ])
    },
  })
}
