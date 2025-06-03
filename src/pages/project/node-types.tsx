import { Handle, NodeToolbar, Position, type NodeProps, type Node, type XYPosition } from "@xyflow/react"
import { MdKeyboard, MdPiano, MdSpeaker } from "react-icons/md"
import { TbMathFunction } from "react-icons/tb"
import "./node-types.css"
import type * as Tone from "tone"
import { PiWaveSine } from "react-icons/pi"
import { nextNodeUid } from "./node-uid"

export type SynthNode = Node<{ synth: Tone.Synth }>

export const createSynthNode = (synth: Tone.Synth, { x = 0, y = 0 }: Partial<XYPosition> = {}) =>
  ({
    id: nextNodeUid("synth"),
    type: "synthNode",
    data: { synth },
    position: { x, y },
  }) satisfies SynthNode

export type InputNode = Node<Record<string, unknown>, "inputNode">

export const createInputNode = ({ x = 0, y = 0 }: Partial<XYPosition> = {}) =>
  ({
    id: nextNodeUid("input"),
    type: "inputNode",
    data: {},
    position: { x, y },
  }) satisfies InputNode

export type FxNode = Node<{ effect: Tone.ToneAudioNode }, "fxNode">

export const createFxNode = (effect: Tone.ToneAudioNode, { x = 0, y = 0 }: Partial<XYPosition> = {}) =>
  ({
    id: nextNodeUid("fx"),
    type: "fxNode",
    data: { effect },
    position: { x, y },
  }) satisfies FxNode

export type OutputNode = Node<Record<string, unknown>, "outputNode">

export const createOutputNode = ({ x = 0, y = 0 }: Partial<XYPosition> = {}) =>
  ({
    id: nextNodeUid("output"),
    type: "outputNode",
    data: {},
    position: { x, y },
  }) satisfies OutputNode

export type SignalNode = Node<{ frequency: number; enabled: boolean }, "signalNode">

export const createSignalNode = (
  {
    frequency,
    enabled = false,
  }: {
    frequency: number
    enabled?: boolean
  },
  { x = 0, y = 0 }: Partial<XYPosition> = {},
) =>
  ({
    id: nextNodeUid("signal"),
    type: "signalNode",
    data: { frequency, enabled },
    position: { x, y },
  }) satisfies SignalNode

export type AudioComponentNode = SynthNode | InputNode | FxNode | OutputNode | SignalNode

export const findSynthNode = (nodes: Node[], id: string) =>
  nodes.find((n) => n.id === id && n.type === "synthNode") as Node<{ synth: Tone.Synth }, "synthNode"> | undefined

export const findFxNode = (nodes: Node[], id: string) =>
  nodes.find((n) => n.id === id && n.type === "fxNode") as Node<{ effect: Tone.ToneAudioNode }, "fxNode"> | undefined

export const findSignalNode = (nodes: Node[], id: string) =>
  nodes.find((n) => n.id === id && n.type === "signalNode") as Node<{ signal: Tone.Signal }, "signalNode"> | undefined

export const InputNodeView = ({ isConnectable }: NodeProps<InputNode>) => {
  return (
    <div className="patch-node">
      <MdKeyboard />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

export const SignalNodeView = ({ isConnectable, data: { enabled } }: NodeProps<SignalNode>) => {
  return (
    <div className="patch-node">
      {enabled ? (
        <b>
          <PiWaveSine />
        </b>
      ) : (
        <PiWaveSine />
      )}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

export const SynthNodeView = ({ isConnectable }: NodeProps<SignalNode>) => {
  return (
    <div className="patch-node">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <MdPiano />
    </div>
  )
}

export const OutputNodeView = ({ isConnectable }: NodeProps<OutputNode>) => {
  return (
    <div className="patch-node">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <MdSpeaker />
    </div>
  )
}

export const FxNodeView = ({ isConnectable }: NodeProps<FxNode>) => {
  return (
    <div className="patch-node">
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <TbMathFunction />
      <NodeToolbar />
    </div>
  )
}

export const NODE_TYPES = {
  inputNode: InputNodeView,
  synthNode: SynthNodeView,
  outputNode: OutputNodeView,
  fxNode: FxNodeView,
  signalNode: SignalNodeView,
}
