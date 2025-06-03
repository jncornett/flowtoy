import { TbMathFunction } from "react-icons/tb"
import * as Tone from "tone"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type NodeChange,
  type EdgeChange,
  type Node,
  type Edge,
  type Connection,
  ConnectionLineType,
  ControlButton,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  NODE_TYPES,
  type AudioComponentNode,
  type SynthNode,
} from "./node-types"
import { MdPlayArrow } from "react-icons/md"
import { useEffect } from "react"
import { KEYMAP } from "./keymap"

export type ProjectProps = {
  nodes?: Node[]
  edges?: Edge[]
  onNodesChange?: (changes: NodeChange<AudioComponentNode>[]) => void
  onEdgesChange?: (changes: EdgeChange[]) => void
  onConnect?: (params: Connection) => void
  onReconnect?: (oldEdge: Edge, newConnection: Connection) => void
  onAddEffectNode?: () => void
  onEdgesDelete?: (edges: Edge[]) => void
  onNodesDelete?: (nodes: Node[]) => void
}

export function Project({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  onAddEffectNode,
  onEdgesDelete,
  onNodesDelete,
}: ProjectProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = KEYMAP[event.key]
      if (!note) return
      const nodeIds =
        edges?.filter((e) => e.source === "input-0")?.map((e) => e.target) ?? []

      for (const node of nodes ?? [])
        if (nodeIds.includes(node.id) && node.type === "synthNode") {
          const { synth } = (node as SynthNode).data
          synth.triggerAttackRelease(note, "8n")
        }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nodes, edges])
  return (
    <ReactFlow
      colorMode="system"
      fitView
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      onEdgesDelete={onEdgesDelete}
      onNodesDelete={onNodesDelete}
      nodeTypes={NODE_TYPES}
      defaultEdgeOptions={{
        type: "smoothstep",
        deletable: true,
        reconnectable: true,
      }}
      onBeforeDelete={({ nodes }) =>
        Promise.resolve(
          nodes.every((n) => n.type !== "inputNode" && n.type !== "outputNode"),
        )
      }
      connectionLineType={ConnectionLineType.Step}
      isValidConnection={(edge) => {
        const sourceNodeType =
          nodes?.find((n) => n.id === edge.source)?.type ?? ""
        const targetNodeType =
          nodes?.find((n) => n.id === edge.target)?.type ?? ""
        switch (sourceNodeType) {
          case "inputNode":
            return targetNodeType === "synthNode"
          case "synthNode":
            return (
              targetNodeType === "fxNode" || targetNodeType === "outputNode"
            )
          case "fxNode":
            return (
              targetNodeType === "outputNode" || targetNodeType === "fxNode"
            )
          default:
            return false
        }
      }}
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls>
        <ControlButton title="Start Playing" onClick={() => Tone.start()}>
          <MdPlayArrow />
        </ControlButton>
        <ControlButton title="Add Effect Node" onClick={onAddEffectNode}>
          <TbMathFunction />
        </ControlButton>
      </Controls>
    </ReactFlow>
  )
}

export default Project
