import type { Node, Edge } from "@xyflow/react"
import * as Tone from "tone"
import {
  createFxNode,
  createInputNode,
  createOutputNode,
  createSignalNode,
  createSynthNode,
} from "./node-types"

export const INITIAL_NODES = [
  createInputNode(),
  createSynthNode(new Tone.Synth().toDestination(), { x: 200 }),
  createFxNode(new Tone.Delay(0.1), { x: 300 }),
  createOutputNode({ x: 400 }),
  createSignalNode({ frequency: 440, enabled: true }, { x: 500 }),
] satisfies Node[]

export const INITIAL_EDGES = [
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
] satisfies Edge[]
