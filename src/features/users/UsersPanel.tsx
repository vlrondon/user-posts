import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { useUsers } from './useUsers'

export function UsersPanel() {
  const { data: users, isPending, isError, error, refetch } = useUsers()

  return (
    <section className="panel" aria-labelledby="users-heading">
      <h2 id="users-heading">Usuarios</h2>

      {isPending ? (
        <LoadingState label="Cargando usuarios…" />
      ) : isError ? (
        <ErrorState title="No se pudieron cargar los usuarios." error={error} onRetry={() => refetch()} />
      ) : (
        <ul className="user-list">
          {users.map((user) => (
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
