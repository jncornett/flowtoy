import { useState } from "react"
import { makeUidGenerator } from "./graph"
import { PiFunctionBold } from "react-icons/pi"

export type Pen = { type: "addSynth" }

const uids = makeUidGenerator()

export function Notebook() {
  const [pen, setPen] = useState<Pen>({ type: "addSynth" })
  const [synths, setSynths] = useState<
    { id: string; pos: { x: number; y: number } }[]
  >([])
  const [pos, setPos] = useState({ x: 0, y: 0 })
  console.log("synths", synths)
  return (
    <article>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <svg
        viewBox="0 0 1024 1024"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const cx = ((e.clientX - rect.left) / rect.width) * 1024
          const cy = ((e.clientY - rect.top) / rect.height) * 1024
          switch (pen.type) {
            case "addSynth":
              {
                setSynths((synths) => [
                  ...synths,
                  {
                    id: uids("synth"),
                    pos: { x: cx, y: cy },
                  },
                ])
              }
              break
          }
        }}
      >
        <title>Patch</title>
        {synths.map((synth) => (
          <>
            <circle
              key={synth.id}
              cx={synth.pos.x}
              cy={synth.pos.y}
              r={10}
              fill="red"
            />
            <PiFunctionBold
              key={synth.id}
              cx={synth.pos.x}
              cy={synth.pos.y}
              x={synth.pos.x}
              y={synth.pos.y}
            />
          </>
        ))}
      </svg>
    </article>
  )
}

export default Notebook
