import * as Tone from "tone";
import { useEffect, useReducer, useState } from "react";
import { MdPiano, MdPianoOff, MdOutlineSpeaker } from "react-icons/md";
import { PiMagicWand } from "react-icons/pi";
import "./Old.css";

export type XY = {
	x: number;
	y: number;
};

export type WorkspaceSynthState = {
	id: string;
	keyboardInput?: boolean;
	toDestination?: boolean;
	distortion?: string;
	synth: Tone.Synth;
	pos: XY;
};

export type WorkspaceFxState = {
	id: string;
	type: "distortion";
	fx: Tone.Distortion;
	pos: XY;
};

export type WorkspaceState = {
	synths: WorkspaceSynthState[];
	fx: WorkspaceFxState[];
};

export type WorkspaceAction =
	| {
			type: "enableKeyboardInput";
			synthId: string;
	  }
	| {
			type: "disableKeyboardInput";
			synthId: string;
	  }
	| { type: "enableDistortion"; synthId: string }
	| {
			type: "disableDistortion";
			synthId: string;
	  };

const initialWorkspaceState = (): WorkspaceState => ({
	synths: [
		{
			id: "synth1",
			keyboardInput: true,
			toDestination: true,
			synth: new Tone.Synth().toDestination(),
			pos: { x: 100, y: 100 },
		},
	],
	fx: [],
});

const reduceWorkspace = (state: WorkspaceState, action: WorkspaceAction) => {
	switch (action.type) {
		case "enableKeyboardInput":
			return {
				...state,
				synths: state.synths.map((synth) =>
					synth.id === action.synthId && !synth.keyboardInput
						? {
								...synth,
								keyboardInput: !synth.keyboardInput,
							}
						: synth,
				),
			};
		case "disableKeyboardInput":
			return {
				...state,
				synths: state.synths.map((synth) =>
					synth.id === action.synthId && synth.keyboardInput
						? {
								...synth,
								keyboardInput: !synth.keyboardInput,
							}
						: synth,
				),
			};
		case "enableDistortion": {
			const i = state.synths.findIndex(
				(s) => s.id === action.synthId && !s.distortion,
			);
			if (i < 0) return state;
			const synth = state.synths[i];
			synth.synth.disconnect();
			const dist = new Tone.Distortion(0.7).toDestination();
			const distId = `distortion-${synth.id}`;
			synth.synth.connect(dist);
			return {
				...state,
				synths: [
					...state.synths.slice(0, i),
					{
						...synth,
						toDestination: false,
						distortion: distId,
					},
					...state.synths.slice(i + 1),
				],
				fx: [
					...state.fx,
					{
						id: distId,
						type: "distortion",
						fx: dist,
						pos: { x: synth.pos.x + 100, y: synth.pos.y },
					},
				],
			} as WorkspaceState;
		}
		default:
			return state;
	}
};

const KEYMAP: Record<string, string | undefined> = {
	a: "C4",
	s: "Eb4",
	d: "F4",
	f: "G4",
	g: "Bb4",
	h: "C5",
};

export function Old() {
	const [workspace, dispatchWorkspace] = useReducer(
		reduceWorkspace,
		initialWorkspaceState(),
	);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const handleKeypress = (event: KeyboardEvent) => {
			const note = KEYMAP[event.key];
			if (!note || !ready) return;
			for (const synth of workspace.synths.filter((s) => s.keyboardInput))
				synth.synth.triggerAttackRelease(note, "8n");
		};
		document.addEventListener("keypress", handleKeypress);
		return () => {
			document.removeEventListener("keypress", handleKeypress);
		};
	}, [workspace, ready]);
	return (
		<>
			<button
				onClick={() => {
					if (!ready) Tone.start().then(() => setReady(true));
				}}
				type="button"
			>
				Play
			</button>
			<svg viewBox="0 0 1024 1024">
				<title>Patch</title>
				{workspace.synths.map((synth) => {
					const size = 80;
					return (
						<g
							key={synth.id}
							transform={`translate(${synth.pos.x}, ${synth.pos.y})`}
							className="synth-node"
						>
							<path
								fill="red"
								d={`M ${-size / 2} ${-size / 2} V ${size / 2} L ${size / 2} 0 Z`}
							/>
							<NodeWidgets
								synth={synth}
								onEnableKeyboardInput={() =>
									dispatchWorkspace({
										type: "enableKeyboardInput",
										synthId: synth.id,
									})
								}
								onDisableKeyboardInput={() =>
									dispatchWorkspace({
										type: "disableKeyboardInput",
										synthId: synth.id,
									})
								}
								onEnableDistortion={() =>
									dispatchWorkspace({
										type: "enableDistortion",
										synthId: synth.id,
									})
								}
								onDisableDistortion={() =>
									dispatchWorkspace({
										type: "disableDistortion",
										synthId: synth.id,
									})
								}
							/>
						</g>
					);
				})}
			</svg>
		</>
	);
}

function filterBoolean<T>(value: T | false | null | undefined): value is T {
	return value !== false && value !== null && value !== undefined;
}

const NodeWidgets = ({
	synth,
	onEnableKeyboardInput = () => {},
	onDisableKeyboardInput = () => {},
	onEnableDistortion = () => {},
	onDisableDistortion = () => {},
}: {
	synth: WorkspaceSynthState;
	onEnableKeyboardInput?: () => void;
	onDisableKeyboardInput?: () => void;
	onEnableDistortion?: () => void;
	onDisableDistortion?: () => void;
}) => {
	const fontSize = 60;
	const widgets = [
		{
			key: "keyboard-toggle",
			node: (
				<a
					href="void(0)"
					title="Toggle keyboard input"
					onClick={(e) => {
						e.preventDefault();
						if (synth.keyboardInput) onDisableKeyboardInput();
						else onEnableKeyboardInput();
					}}
				>
					{synth.keyboardInput ? (
						<MdPianoOff fontSize={fontSize} className="synth-node-widget" />
					) : (
						<MdPiano fontSize={fontSize} className="synth-node-widget" />
					)}
				</a>
			),
		},
		{
			key: "fx",
			node: (
				<a
					href="void(0)"
					title="FX"
					onClick={(e) => {
						e.preventDefault();
						if (synth.distortion) onDisableDistortion();
						else onEnableDistortion();
					}}
				>
					<PiMagicWand fontSize={fontSize} className="synth-node-widget" />,
				</a>
			),
		},
		synth.toDestination && {
			key: "to-destination",
			node: (
				<MdOutlineSpeaker fontSize={fontSize} className="synth-node-widget" />
			),
		},
	].filter(filterBoolean);
	return (
		<g className="synth-node-widgets">
			<circle cx={0} cy={0} r={80} fill="transparent" stroke="white" />
			{widgets.map(({ key, node }, i) => {
				const r = 40;
				const angle = (i * Math.PI) / (widgets.length / 2);
				const x = r * Math.cos(angle);
				const y = r * Math.sin(angle);
				return (
					<g key={key} transform={`translate(${x}, ${y})`}>
						{node}
					</g>
				);
			})}
		</g>
	);
};

export default Old;
