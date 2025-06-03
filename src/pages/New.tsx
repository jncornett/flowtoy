import "./New.css"
import {
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  reconnectEdge,
} from "@xyflow/react"
import { useCallback, useState } from "react"
import { INITIAL_EDGES, INITIAL_NODES } from "./project/initial-state"
import Project from "./project/Project"
import { nextNodeUid } from "./project/node-uid"
import * as Tone from "tone"
import { findFxNode, findSynthNode } from "./project/node-types"

const disconnectEdge = (edge: Edge, nodes: Node[]) => {
  const sourceType = edge.source.split("-")[0]
  const targetType = edge.target.split("-")[0]
  switch (sourceType) {
    case "synth": {
      let destination: Tone.InputNode | undefined
      switch (targetType) {
        case "fx": {
          const fxNode = findFxNode(nodes, edge.target)
          destination = fxNode?.data.effect
          break
        }
        case "output":
          destination = Tone.getDestination()
          break
      }
      if (destination) {
        const synthNode = findSynthNode(nodes, edge.source)
        synthNode?.data.synth?.disconnect(destination)
      }
      break
    }
    case "fx": {
      let destination: Tone.InputNode | undefined
      switch (targetType) {
        case "fx": {
          const fxNode = findFxNode(nodes, edge.target)
          destination = fxNode?.data.effect
          break
        }
        case "output":
          destination = Tone.getDestination()
          break
      }
      const fxNode = findFxNode(nodes, edge.source)
      if (destination) fxNode?.data.effect.disconnect(destination)
      break
    }
  }
}

const connectEdge = (params: Connection, nodes: Node[]) => {
  const sourceType = params.source.split("-")[0]
  const targetType = params.target.split("-")[0]
  switch (sourceType) {
    case "synth": {
      let destination: Tone.InputNode | undefined
      switch (targetType) {
        case "fx": {
          const fxNode = findFxNode(nodes, params.target)
          destination = fxNode?.data.effect
          break
        }
        case "output":
          destination = Tone.getDestination()
          break
      }
      const synthNode = findSynthNode(nodes, params.source)
      if (destination) synthNode?.data.synth?.connect(destination)
      break
    }
    case "fx": {
      let destination: Tone.InputNode | undefined
      switch (targetType) {
        case "fx": {
          const fxNode = findFxNode(nodes, params.target)
          destination = fxNode?.data.effect
          break
        }
        case "output":
          destination = Tone.getDestination()
          break
      }
      const fxNode = findFxNode(nodes, params.source)
      if (destination) fxNode?.data.effect.connect(destination)
    }
  }
}

export function New() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [edges, setEdges] = useState(INITIAL_EDGES)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      connectEdge(params, nodes)
      return setEdges((eds) => addEdge(params, eds))
    },
    [nodes],
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      disconnectEdge(oldEdge, nodes)
      connectEdge(newConnection, nodes)
      return setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
    },
    [nodes],
  )

  const onEdgesDelete = useCallback(
    (edges: Edge[]) => {
      for (const edge of edges) disconnectEdge(edge, nodes)
    },
    [nodes],
  )

  return (
    <Project
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      onEdgesDelete={onEdgesDelete}
      onAddEffectNode={() => {
        setNodes((nds) => [
          ...nds,
          {
            id: nextNodeUid("fx"),
            type: "fxNode",
            data: { label: "fx", effect: new Tone.Distortion(0.5) },
            position: { x: 0, y: 0 },
          },
        ])
      }}
    />
  )
}

export default New
