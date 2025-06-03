export const uidGenerator = () => {
	const state = new Map<string, Generator<number>>();
	function* countUp() {
		let i = 0;
		while (true) yield i++;
	}
	return (prefix: string) => {
		let g = state.get(prefix);
		if (!g) {
			g = countUp();
			state.set(prefix, g);
		}
		return `${prefix}-${g.next().value}`;
	};
};
