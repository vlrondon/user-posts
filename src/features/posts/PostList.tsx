import type { Post } from './post.schema'

type PostListProps = {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="state">Este usuario todavía no tiene publicaciones.</p>
  }

  return (
    <ul className="post-list" aria-label="Publicaciones">
      {posts.map((post) => (
        <li key={post.id} className="post">
          <h3 className="post__title">{post.title}</h3>
          <p className="post__body">{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
