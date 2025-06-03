import type { Node, Edge } from "@xyflow/react";
import * as Tone from "tone";
import { nextNodeUid } from "./node-uid";

export const initialNodes = [
	{
		id: nextNodeUid("input"),
		type: "inputNode",
		data: { label: "Input 0" },
		position: { x: 10, y: 10 },
	},
	{
		id: nextNodeUid("synth"),
		type: "synthNode",
		data: { label: "Synth 0", synth: new Tone.Synth().toDestination() },
		position: { x: 200, y: 10 },
	},
	{
		id: nextNodeUid("fx"),
		type: "fxNode",
		data: {
			label: "FX 0",
			effect: new Tone.Delay(0.5) as Tone.ToneAudioNode<any>,
		},
		position: { x: 300, y: 200 },
	},
	{
		id: nextNodeUid("output"),
		type: "outputNode",
		data: { label: "Output 0" },
		position: { x: 400, y: 10 },
	},
	{
		id: nextNodeUid("signal"),
		type: "signalNode",
		data: { frequency: 440, enabled: true },
		position: { x: 500, y: 10 },
	},
] satisfies Node[];

export const initialEdges = [
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
] satisfies Edge[];
