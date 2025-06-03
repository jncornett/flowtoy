import "./App.css"
import { Route, Routes } from "react-router-dom"
import { Link } from "react-router-dom"
import type { JSX, ReactNode } from "react"
import New from "./pages/New"

const ROUTES = [
  {
    title: "Home",
    path: "/",
    element: () => <Home />,
  },
  {
    title: "New",
    path: "/new",
    element: () => (
      <Page>
        <New />
      </Page>
    ),
  },
] satisfies {
  title: string
  path: string
  element: () => JSX.Element
}[]

export function App() {
  return (
    <Routes>
      {ROUTES.map((r) => (
        <Route key={r.path} path={r.path} element={r.element()} />
      ))}
    </Routes>
  )
}

const Home = () => (
  <article>
    <nav>
      <ul>
        {ROUTES.slice(1).map((r) => (
          <li key={r.path}>
            <Link to={r.path}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </article>
)

const Page = ({ children = null }: { children?: ReactNode }) => (
  <>
    <header>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </header>
    {children}
  </>
)

export default App
