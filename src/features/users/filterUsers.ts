import type { User } from './user.schema'

/** Minúsculas y sin acentos, para que "jose" encuentre "José". */
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterUsersByName(users: User[], query: string) {
  const needle = normalize(query)
  if (!needle) return users
  return users.filter((user) => normalize(user.name).includes(needle))
}
