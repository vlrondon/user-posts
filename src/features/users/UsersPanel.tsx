import { useState } from 'react'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { filterUsersByName } from './filterUsers'
import { useUsers } from './useUsers'

export function UsersPanel() {
  const { data: users, isPending, isError, error, refetch } = useUsers()
  const [search, setSearch] = useState('')

  // Estado derivado: se calcula en cada render, sin useEffect ni estado duplicado.
  const visibleUsers = users ? filterUsersByName(users, search) : []

  return (
    <section className="panel" aria-labelledby="users-heading">
      <h2 id="users-heading">Usuarios</h2>

      <label className="field">
        <span className="field__label">Buscar por nombre</span>
        <input
          type="search"
          className="field__input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ej.: Leanne"
        />
      </label>

      {isPending ? (
        <LoadingState label="Cargando usuarios…" />
      ) : isError ? (
        <ErrorState title="No se pudieron cargar los usuarios." error={error} onRetry={() => refetch()} />
      ) : visibleUsers.length === 0 ? (
        <p className="state">Ningún usuario coincide con «{search.trim()}».</p>
      ) : (
        <ul className="user-list">
          {visibleUsers.map((user) => (
            <li key={user.id} className="user-item">
              <span className="user-item__name">{user.name}</span>
              <span className="user-item__meta">
                @{user.username} · {user.company.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
