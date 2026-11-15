import type { Post } from './post.schema'

// JSONPlaceholder responde siempre con id 101 a cualquier alta. Para que dos
// publicaciones nuevas no compartan id (y `key` de React), se les asigna un id
// local negativo, que además las distingue de las que vienen del servidor.
let localSequence = 0

export const nextLocalId = () => -(localSequence += 1)

export const isLocalPost = (post: Post) => post.id < 0
