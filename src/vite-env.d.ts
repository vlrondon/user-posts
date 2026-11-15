/// <reference types="vite/client" />

// Variables de entorno que usa la app. Vite solo expone al navegador las que
// empiezan por VITE_, así que aquí nunca debe ir un secreto.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
