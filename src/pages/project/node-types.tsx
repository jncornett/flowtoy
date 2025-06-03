import {
	Handle,
	NodeToolbar,
	Position,
	type NodeProps,
	type Node,
} from "@xyflow/react";
import { MdKeyboard, MdPiano, MdSpeaker } from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import "./node-types.css";
import type * as Tone from "tone";
import { PiWaveSine } from "react-icons/pi";

export const createSignalNode = (
	id: string,
	frequency: number,
	enabled = false,
) =>
	({
		id,
		type: "signalNode",
		data: { frequency, enabled },
		position: { x: 0, y: 0 },
	}) satisfies Node<{ frequency: number; enabled: boolean }, "signalNode">;

export const findSynthNode = (nodes: Node[], id: string) =>
	nodes.find((n) => n.id === id && n.type === "synthNode") as
		| Node<{ synth: Tone.Synth }, "synthNode">
		| undefined;

export const findFxNode = (nodes: Node[], id: string) =>
	nodes.find((n) => n.id === id && n.type === "fxNode") as
		| Node<{ effect: Tone.ToneAudioNode<any> }, "fxNode">
		| undefined;

export const findSignalNode = (nodes: Node[], id: string) =>
	nodes.find((n) => n.id === id && n.type === "signalNode") as
		| Node<{ signal: Tone.Signal }, "signalNode">
		| undefined;

export const InputNode = ({ isConnectable }: NodeProps) => {
	return (
		<div className="patch-node">
			<MdKeyboard />
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
		</div>
	);
};

export const SignalNode = ({
	isConnectable,
	data: { enabled },
}: NodeProps<Node<{ frequency: number; enabled: boolean }, "signalNode">>) => {
	return (
		<div className="patch-node">
			{enabled ? (
				<b>
					<PiWaveSine />
				</b>
			) : (
				<PiWaveSine />
			)}
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
		</div>
	);
};

export const SynthNode = ({ isConnectable }: { isConnectable: boolean }) => {
	return (
		<div className="patch-node">
			<Handle
				type="target"
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
			<MdPiano />
		</div>
	);
};

export const OutputNode = ({ isConnectable }: { isConnectable: boolean }) => {
	return (
		<div className="patch-node">
			<Handle
				type="target"
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<MdSpeaker />
		</div>
	);
};

export const FxNode = ({ isConnectable }: { isConnectable: boolean }) => {
	return (
		<div className="patch-node">
			<Handle
				type="target"
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<Handle
				type="source"
				position={Position.Right}
				isConnectable={isConnectable}
			/>
			<TbMathFunction />
			<NodeToolbar />
		</div>
	);
};

export const nodeTypes = {
	inputNode: InputNode,
	synthNode: SynthNode,
	outputNode: OutputNode,
	fxNode: FxNode,
	signalNode: SignalNode,
};
