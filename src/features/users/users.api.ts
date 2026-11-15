import { z } from 'zod'
import { apiFetch } from '../../api/client'
import { userSchema } from './user.schema'

export function fetchUsers() {
  return apiFetch('/users', z.array(userSchema))
}
