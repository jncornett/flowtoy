import type { Node, Edge } from "@xyflow/react"
import { Delay, Synth } from "tone"
import {
  createInputNode,
  createSynthNode,
  createFxNode,
  createOutputNode,
  createSignalNode,
} from "./pages/project/node-types"

export type Note = `${"A" | "B" | "C" | "D" | "E" | "F" | "G"}${"" | "#" | "b"}${1 | 2 | 3 | 4 | 5 | 6}`

export type Defaults = {
  initialState?: {
    nodes: Node[]
    edges: Edge[]
  }
  keymap: Record<string, Note>
}

export default {
  initialState: {
    nodes: [
      createInputNode(),
      createSynthNode(new Synth().toDestination(), { x: 200 }),
      createFxNode(new Delay(0.1), { x: 300 }),
      createOutputNode({ x: 400 }),
      createSignalNode({ frequency: 440, enabled: true }, { x: 500 }),
    ],
    edges: [
      {
        id: "input-0/synth-0",
        source: "input-0",
        target: "synth-0",
      },
      {
        id: "synth-0/output-0",
        source: "synth-0",
        target: "output-0",
      },
    ],
  },
  keymap: {
    a: "C5",
    s: "Eb5",
    d: "F5",
    f: "G5",
    g: "Bb5",
    h: "C6",
  },
} satisfies Readonly<Defaults>
