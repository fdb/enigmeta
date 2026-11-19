// Word Maze. A maze is carved with recursive backtracking. Cells that belong
// to a hidden word are filled with a grey dither as the maze reaches them, so the word shows
// up gradually and never all at once. Then the maze is torn down again.

import { reducedMotion } from "./state.js";

const GLYPHS = {
	4: ["10010", "10010", "10010", "11111", "00010", "00010", "00010"],
	0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
	l: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
	o: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
	s: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
	t: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
	p: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
};
const WORDS = ["404", "lost", "oops"];
const COLS = 49;
const ROWS = 17;

export function startMaze(canvas) {
	const ctx = canvas.getContext("2d");
	const cell = 20;
	canvas.width = COLS * cell;
	canvas.height = ROWS * cell;

	// A 50% dither is the only grey a 1-bit screen has.
	const tile = document.createElement("canvas");
	tile.width = tile.height = 4;
	const tctx = tile.getContext("2d");
	tctx.fillStyle = "#fff";
	tctx.fillRect(0, 0, 4, 4);
	tctx.fillStyle = "#000";
	tctx.fillRect(0, 0, 2, 2);
	tctx.fillRect(2, 2, 2, 2);
	const grey = ctx.createPattern(tile, "repeat");

	let wordIndex = 0;
	let mask, walls, order, cursor, stack, visited, phase, hold;

	function reset() {
		const word = WORDS[wordIndex % WORDS.length];
		mask = new Uint8Array(COLS * ROWS);
		const scale = 2;
		const total = word.length * 5 * scale + (word.length - 1) * 2;
		const left = Math.floor((COLS - total) / 2);
		const top = Math.floor((ROWS - 7 * scale) / 2);
		[...word].forEach((ch, n) => {
			GLYPHS[ch].forEach((line, gy) => {
				[...line].forEach((bit, gx) => {
					if (bit !== "1") return;
					for (let dy = 0; dy < scale; dy++)
						for (let dx = 0; dx < scale; dx++)
							mask[(top + gy * scale + dy) * COLS + left + n * (5 * scale + 2) + gx * scale + dx] = 1;
				});
			});
		});
		walls = new Uint8Array(COLS * ROWS).fill(15); // bits: top, right, bottom, left
		visited = new Uint8Array(COLS * ROWS);
		order = [];
		const start = Math.floor(Math.random() * COLS * ROWS);
		stack = [start];
		visited[start] = 1;
		order.push(start);
		cursor = 0;
		phase = "grow";
		hold = 0;
	}

	function carve() {
		while (stack.length) {
			const current = stack.at(-1);
			const x = current % COLS;
			const y = (current - x) / COLS;
			const options = [];
			if (y > 0 && !visited[current - COLS]) options.push([current - COLS, 1, 4]);
			if (x < COLS - 1 && !visited[current + 1]) options.push([current + 1, 2, 8]);
			if (y < ROWS - 1 && !visited[current + COLS]) options.push([current + COLS, 4, 1]);
			if (x > 0 && !visited[current - 1]) options.push([current - 1, 8, 2]);
			if (!options.length) {
				stack.pop();
				continue;
			}
			const [next, mine, theirs] = options[Math.floor(Math.random() * options.length)];
			walls[current] &= ~mine;
			walls[next] &= ~theirs;
			visited[next] = 1;
			stack.push(next);
			order.push(next);
			return true;
		}
		return false;
	}

	function draw() {
		const ink = "#000";
		const paper = "#fff";
		ctx.fillStyle = paper;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = ink;
		ctx.lineWidth = 2;
		ctx.lineCap = "square";
		ctx.beginPath();
		for (let i = 0; i < cursor; i++) {
			const c = order[i];
			const x = (c % COLS) * cell;
			const y = Math.floor(c / COLS) * cell;
			if (mask[c]) {
				ctx.fillStyle = grey;
				ctx.fillRect(x, y, cell, cell);
			}
			const w = walls[c];
			if (w & 1) { ctx.moveTo(x, y); ctx.lineTo(x + cell, y); }
			if (w & 2) { ctx.moveTo(x + cell, y); ctx.lineTo(x + cell, y + cell); }
			if (w & 4) { ctx.moveTo(x, y + cell); ctx.lineTo(x + cell, y + cell); }
			if (w & 8) { ctx.moveTo(x, y); ctx.lineTo(x, y + cell); }
		}
		ctx.stroke();
	}

	function frame() {
		if (phase === "grow") {
			for (let i = 0; i < 4; i++) carve();
			cursor = order.length;
			if (order.length === COLS * ROWS) phase = "hold";
		} else if (phase === "hold") {
			if (++hold > 200) phase = "shrink";
		} else {
			cursor = Math.max(0, cursor - 7);
			if (cursor === 0) {
				wordIndex++;
				reset();
			}
		}
		draw();
		if (!document.hidden) requestAnimationFrame(frame);
		else document.addEventListener("visibilitychange", () => requestAnimationFrame(frame), { once: true });
	}

	reset();
	if (reducedMotion) {
		while (carve());
		cursor = order.length;
		draw();
	} else {
		requestAnimationFrame(frame);
	}
}
