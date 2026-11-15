# user-posts

Pequeña app en React + TypeScript sobre la API pública de [JSONPlaceholder](https://jsonplaceholder.typicode.com):

- Lista de usuarios con búsqueda por nombre.
- Al elegir un usuario se ven sus publicaciones y se puede crear una nueva con un formulario validado.
- Estados de carga, error (con reintento) y vacío en cada lista.

## Cómo ejecutarlo

Requiere Node.js 22.12 o superior.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Tests (Vitest + Testing Library + MSW) |
| `npm run test:watch` | Tests en modo observación |
| `npm run typecheck` | Comprobación de tipos |
| `npm run lint` | Linter (oxlint) |
| `npm run build` | Comprobación de tipos y build de producción |

## Estructura

```
src/
  api/client.ts          Único punto de salida a la red (fetch + validación + ApiError)
  components/            Estados de carga y error reutilizables
  features/
    users/               Esquema, acceso a datos, hook, filtro y panel de usuarios
    posts/               Esquemas, acceso a datos, hooks, lista y formulario
  test/                  Servidor MSW, datos de prueba y renderApp
  App.tsx                Rutas y maquetación
```

## Decisiones

**Organización por funcionalidad.** Cada carpeta de `features/` contiene todo lo suyo (esquema, API, hook, componentes y tests). Para tocar "publicaciones" no hay que saltar entre carpetas `components/`, `hooks/` y `services/`.

**Zod como única definición de los datos.** Los tipos (`User`, `Post`, `NewPostValues`) se infieren de esquemas Zod, no se escriben a mano. El mismo mecanismo valida dos fronteras: lo que llega de la API (`apiFetch` rechaza una respuesta con forma inesperada en lugar de dejar pasar un `undefined` hasta la interfaz) y lo que escribe el usuario en el formulario.

**Los componentes no conocen `fetch`.** Toda la red pasa por `api/client.ts`, que convierte fallos de red, respuestas HTTP de error y respuestas mal formadas en un único tipo `ApiError` con mensaje legible.

**TanStack Query para el estado de servidor.** Aporta carga, error, reintento y caché sin `useEffect` ni estado global. No hay Redux ni Context: el único estado de cliente es el texto del buscador (un `useState`) y el usuario elegido (la URL).

**El usuario elegido vive en la URL** (`/users/:userId`). Se puede recargar, compartir el enlace y usar el botón Atrás. El parámetro se valida antes de pedir nada.

**Alta de publicaciones sin persistencia real.** Tras el `POST`, la publicación se inserta en la caché de TanStack Query, al principio de la lista. Tres consecuencias que tuve en cuenta:

- La API devuelve siempre `id: 101`, así que dos altas seguidas chocarían en la `key` de React. Las publicaciones creadas reciben un id local negativo, que además permite marcarlas como "Nueva".
- La lista de publicaciones usa `staleTime: Infinity`: si se volviera a pedir en segundo plano, lo creado desaparecería porque el servidor no lo tiene.
- No hay actualización optimista: se espera la respuesta y, si falla, se muestra el error y se conserva lo escrito.

**Formulario con React Hook Form + Zod.** Título y texto obligatorios (un campo con solo espacios cuenta como vacío) y título con longitud máxima. Los errores aparecen junto a cada campo y están enlazados con `aria-invalid` y `aria-describedby`; los campos obligatorios están marcados.

**Tests desde el punto de vista del usuario.** Montan la app completa y simulan la red con MSW, en vez de simular hooks o `fetch`. Así se prueban de verdad los estados de carga y error, y los tests no dependen de la implementación. Cada test declara las respuestas que necesita; una petición no declarada hace fallar el test.

Cobertura por requisito del enunciado:

| Requisito | Test |
| --- | --- |
| Lista de usuarios y estado de carga | `UsersPanel.test.tsx` |
| Búsqueda por nombre | `UsersPanel.test.tsx`, `filterUsers.test.ts` |
| Estado de error y reintento | `UsersPanel.test.tsx`, `UserPostsPage.test.tsx` |
| Publicaciones del usuario elegido | `UserPostsPage.test.tsx` |
| Formulario validado | `NewPostForm.test.tsx`, `newPost.schema.test.ts` |
| La nueva publicación aparece en la lista | `NewPostForm.test.tsx` |
| Capa de datos | `client.test.ts` |

**CSS plano, sin librería de componentes.** Para una pantalla, una librería de UI añade peso y decisiones que no aportan a lo que se evalúa. HTML semántico, foco visible y maquetación de una columna en móvil.

## Qué haría con más tiempo

- Guardar el texto de búsqueda en la URL (`?q=`) y aplicar *debounce* si la lista fuera grande o el filtrado se hiciera en servidor.
- Paginación o lista virtualizada para volúmenes reales.
- Un test de extremo a extremo con Playwright contra la API real, como comprobación de humo.
- Integración continua (lint, tipos, tests y build en cada *push*) y despliegue de vista previa.
- Límite de errores (*error boundary*) global para fallos de renderizado.
- Persistir las publicaciones creadas (por ejemplo en `localStorage`) para que sobrevivan a una recarga.
- Editar y eliminar publicaciones, con actualización optimista y vuelta atrás si falla.
- Internacionalización: los textos están en español dentro de los componentes.
- Sistema de diseño mínimo (tokens y componentes base) si la app creciera.

## Cómo usé la IA

Trabajé con Claude (Anthropic) como agente de desarrollo. Lo cuento tal como fue.

**Qué le pedí**

1. Analizar el enunciado y proponer arquitectura, librerías y plan de commits, partiendo de los patrones que uso en mis proyectos (esquemas Zod como fuente única, capa de datos separada, organización por funcionalidad, un test por criterio de aceptación) y diciendo cuáles sobraban en una app de este tamaño.
2. Implementar la propuesta en commits pequeños, cada uno con la app funcionando y los tests en verde.

**Qué acepté**

- La propuesta de arquitectura y el descarte de lo que no aportaba aquí (estado global, librería de componentes, monorepo, tests de extremo a extremo).
- El código generado, incluidas decisiones que surgieron al implementar: validar las respuestas de la API con Zod, el id local negativo para las publicaciones creadas y `staleTime: Infinity` en la lista de publicaciones.

**Qué se corrigió por el camino**

- La IA configuró MSW con una opción de una versión anterior (`onUnhandledRequest`); los tests pasaban, pero la comprobación de tipos lo detectó y se cambió por la actual (`onUnhandledFrame`). Es un buen ejemplo de por qué no basta con que los tests pasen.
- La primera versión dejaba la lógica de ids locales dentro del hook de la mutación, y la lista la importaba desde ahí; se movió a un módulo propio (`localPosts.ts`).

**Cómo lo verifiqué**

Comprobación de tipos, linter, tests y build en cada commit, más una revisión visual en escritorio y móvil.
