import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { newPostSchema, type NewPostValues } from './newPost.schema'
import { useCreatePost } from './useCreatePost'

type NewPostFormProps = {
  userId: number
}

export function NewPostForm({ userId }: NewPostFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewPostValues>({
    resolver: zodResolver(newPostSchema),
    defaultValues: { title: '', body: '' },
  })
  const createPost = useCreatePost(userId)

  // handleSubmit solo llama a esta función si el esquema valida.
  const onSubmit = handleSubmit((values) => {
    createPost.mutate(values, { onSuccess: () => reset() })
  })

  return (
    <form className="post-form" onSubmit={onSubmit} noValidate aria-labelledby="new-post-heading">
      <h3 id="new-post-heading">Nueva publicación</h3>
      <p className="post-form__hint">
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="visually-hidden">asterisco</span> son obligatorios.
      </p>

      <div className="field">
        <label className="field__label" htmlFor="post-title">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          className="field__input"
          aria-required="true"
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
          {...register('title')}
        />
        {errors.title && (
          <p id="post-title-error" className="field__error">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="post-body">
          Texto <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="post-body"
          rows={4}
          className="field__input"
          aria-required="true"
          aria-invalid={errors.body ? 'true' : 'false'}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
          {...register('body')}
        />
        {errors.body && (
          <p id="post-body-error" className="field__error">
            {errors.body.message}
          </p>
        )}
      </div>

      {createPost.isError && (
        <p className="state state--error" role="alert">
          No se pudo crear la publicación. {createPost.error.message}
        </p>
      )}

      <button type="submit" className="button" disabled={createPost.isPending}>
        {createPost.isPending ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
