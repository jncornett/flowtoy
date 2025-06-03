export const makeUidGenerator = () => {
  function* counter() {
    let i = 0
    while (true) yield i++
  }
  const generators = new Map<string, Generator<number>>()
  return (key: string) => {
    let g = generators.get(key)
    if (!g) {
      g = counter()
      generators.set(key, g)
    }
    return `${key}-${g.next().value}`
  }
}
