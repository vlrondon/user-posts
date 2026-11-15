import { describe, expect, it } from 'vitest'
import { newPostSchema, TITLE_MAX_LENGTH } from './newPost.schema'

describe('newPostSchema', () => {
  it('acepta título y texto, y recorta los espacios sobrantes', () => {
    const result = newPostSchema.parse({ title: '  Hola  ', body: ' Mundo ' })

    expect(result).toEqual({ title: 'Hola', body: 'Mundo' })
  })

  it('rechaza los campos que solo contienen espacios', () => {
    const result = newPostSchema.safeParse({ title: '   ', body: '\n ' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['title', 'body'])
  })

  it('rechaza un título demasiado largo', () => {
    const result = newPostSchema.safeParse({ title: 'a'.repeat(TITLE_MAX_LENGTH + 1), body: 'Texto' })

    expect(result.success).toBe(false)
  })
})
