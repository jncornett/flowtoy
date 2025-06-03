import { test, expect } from "vitest"
import { makeUidGenerator } from "./graph"

test("makeUidGenerator", () => {
  const uid = makeUidGenerator()
  expect(uid("a")).toMatchInlineSnapshot(`"a-0"`)
  expect(uid("a")).toMatchInlineSnapshot(`"a-1"`)
  expect(uid("b")).toMatchInlineSnapshot(`"b-0"`)
  expect(uid("a")).toMatchInlineSnapshot(`"a-2"`)
  expect(uid("b")).toMatchInlineSnapshot(`"b-1"`)
})
