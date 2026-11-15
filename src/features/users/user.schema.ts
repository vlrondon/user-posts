import { z } from 'zod'

/** Solo los campos que la app usa; el resto de la respuesta se descarta. */
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  company: z.object({ name: z.string() }),
})

export type User = z.infer<typeof userSchema>
