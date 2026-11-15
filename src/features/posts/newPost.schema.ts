import { z } from 'zod'

export const TITLE_MAX_LENGTH = 120

/**
 * Reglas del formulario de nueva publicación. Es la única definición: de aquí
 * salen tanto la validación como el tipo de los valores del formulario.
 * `trim()` hace que un campo con solo espacios cuente como vacío.
 */
export const newPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio.')
    .max(TITLE_MAX_LENGTH, `El título no puede superar los ${TITLE_MAX_LENGTH} caracteres.`),
  body: z.string().trim().min(1, 'El texto es obligatorio.'),
})

export type NewPostValues = z.infer<typeof newPostSchema>
