import { useEffect, useLayoutEffect, useState } from "react"

const newDarkModeMediaQuery = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)")

const initialColorScheme = () =>
  newDarkModeMediaQuery()?.matches ? "dark" : "light"

export const useColorScheme = () => {
  const [scheme, setScheme] = useState(initialColorScheme())
  useLayoutEffect(() => {
    const handleChange = (e: MediaQueryListEvent) =>
      setScheme(e.matches ? "dark" : "light")
    const query = newDarkModeMediaQuery()
    query?.addEventListener("change", handleChange)
    return () => query?.removeEventListener("change", handleChange)
  }, [])
  return scheme
}
