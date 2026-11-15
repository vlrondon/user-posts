import { z } from 'zod'
import { apiFetch } from '../../api/client'
import type { NewPostValues } from './newPost.schema'
import { postSchema } from './post.schema'

export function fetchPostsByUser(userId: number) {
  return apiFetch(`/posts?userId=${userId}`, z.array(postSchema))
}

export function createPost(userId: number, values: NewPostValues) {
  return apiFetch('/posts', postSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ userId, ...values }),
  })
}
