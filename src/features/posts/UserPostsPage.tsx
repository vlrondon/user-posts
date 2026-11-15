import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState'
import { LoadingState } from '../../components/LoadingState'
import { useUsers } from '../users/useUsers'
import { PostList } from './PostList'
import { usePosts } from './usePosts'

export function UserPostsPage() {
  const params = useParams()
  const userId = Number(params.userId)

  // La URL la puede escribir cualquiera: se valida antes de pedir nada.
  if (!Number.isInteger(userId) || userId <= 0) {
    return (
      <section className="panel">
        <p className="state">La dirección no corresponde a ningún usuario.</p>
      </section>
    )
  }

  return <UserPosts userId={userId} />
}

function UserPosts({ userId }: { userId: number }) {
  // Reutiliza la caché de la lista de usuarios: no hace falta otra petición para el nombre.
  const { data: users } = useUsers()
  const user = users?.find((candidate) => candidate.id === userId)
  const { data: posts, isPending, isError, error, refetch } = usePosts(userId)

  return (
    <section className="panel" aria-labelledby="posts-heading">
      <h2 id="posts-heading">{user ? `Publicaciones de ${user.name}` : 'Publicaciones'}</h2>

      {isPending ? (
        <LoadingState label="Cargando publicaciones…" />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar las publicaciones."
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <PostList posts={posts} />
      )}
    </section>
  )
}
