import { API_BASE_URL } from '../api/config'
import type { Post } from '../features/posts/post.schema'
import type { User } from '../features/users/user.schema'

// Los tests simulan la misma URL que usa la app, venga de `.env` o del valor por defecto.
export const API = API_BASE_URL

export const users: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@example.com',
    company: { name: 'Romaguera-Crona' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'ervin@example.com',
    company: { name: 'Deckow-Crist' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'clementine@example.com',
    company: { name: 'Romaguera-Jacobson' },
  },
]

export const postsOfLeanne: Post[] = [
  { id: 1, userId: 1, title: 'Primer título', body: 'Primer texto.' },
  { id: 2, userId: 1, title: 'Segundo título', body: 'Segundo texto.' },
]
