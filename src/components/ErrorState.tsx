type ErrorStateProps = {
  title: string
  error: unknown
  onRetry: () => void
}

export function ErrorState({ title, error, onRetry }: ErrorStateProps) {
  const detail = error instanceof Error ? error.message : 'Error desconocido.'

  return (
    <div className="state state--error" role="alert">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{detail}</p>
      <button type="button" className="button" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  )
}
