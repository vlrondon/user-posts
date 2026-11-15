import { z } from 'zod'
import { apiFetch } from '../../api/client'
import { postSchema } from './post.schema'

export function fetchPostsByUser(userId: number) {
  return apiFetch(`/posts?userId=${userId}`, z.array(postSchema))
}
