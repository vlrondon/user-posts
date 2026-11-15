import { Outlet, Route, Routes } from 'react-router'
import { UserPostsPage } from './features/posts/UserPostsPage'
import { UsersPanel } from './features/users/UsersPanel'

function Layout() {
  return (
    <div className="app">
      <header>
        <h1>Usuarios y publicaciones</h1>
      </header>
      <div className="layout">
        <aside>
          <UsersPanel />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NoSelection() {
  return (
    <section className="panel">
      <p className="state">Elige un usuario de la lista para ver sus publicaciones.</p>
    </section>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NoSelection />} />
        <Route path="users/:userId" element={<UserPostsPage />} />
        <Route path="*" element={<NoSelection />} />
      </Route>
    </Routes>
  )
}

export default App
