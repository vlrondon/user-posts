import { describe, expect, it } from 'vitest'
import { users } from '../../test/fixtures'
import { filterUsersByName } from './filterUsers'

describe('filterUsersByName', () => {
  it('devuelve todos los usuarios si la búsqueda está vacía o son espacios', () => {
    expect(filterUsersByName(users, '')).toEqual(users)
    expect(filterUsersByName(users, '   ')).toEqual(users)
  })

  it('ignora mayúsculas y acentos', () => {
    const withAccent = [{ ...users[0]!, name: 'José Martí' }]

    expect(filterUsersByName(withAccent, 'jose marti')).toHaveLength(1)
    expect(filterUsersByName(users, 'ERVIN').map((u) => u.name)).toEqual(['Ervin Howell'])
  })
})
