// Wandering Ants. Ants walk around the window. When two meet they have a
// child, and nobody dies. The colony follows you from page to page.

import { reducedMotion } from "./state.js";

const KEY = "ants";
const TAU = Math.PI * 2;

export function startAnts() {
	const canvas = document.createElement("canvas");
	canvas.className = "ants";
	canvas.setAttribute("aria-hidden", "true");
	document.body.append(canvas);
	const ctx = canvas.getContext("2d");

	let ants = [];
	let paused = reducedMotion;
	canvas.hidden = paused;
	let width = 0;
	let height = 0;
	const ink = "#000";
	const paper = "#fff";
	let last = 0;
	const pointer = { x: -999, y: -999 };
	const listeners = new Set();

	const cap = () => (innerWidth < 700 ? 10 : 30);

	function resize() {
		const dpr = Math.min(devicePixelRatio || 1, 2);
		width = innerWidth;
		height = innerHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function spawn(x, y, size = 1, cool = 6) {
		ants.push({ x, y, a: Math.random() * TAU, speed: 26 + Math.random() * 22, size, cool, phase: Math.random() * 9 });
	}

	function spawnAtEdge() {
		const side = Math.floor(Math.random() * 4);
		const x = side === 0 ? -10 : side === 1 ? width + 10 : Math.random() * width;
		const y = side === 2 ? -10 : side === 3 ? height + 10 : Math.random() * height;
		spawn(x, y);
	}

	function notify() {
		for (const fn of listeners) fn(ants.length);
	}

	function setCount(n) {
		n = Math.max(0, Math.min(200, Math.round(n)));
		while (ants.length < n) spawnAtEdge();
		ants.length = n;
		notify();
		if (paused) draw();
	}

	function steer(ant, target, amount) {
		let diff = ((target - ant.a + Math.PI) % TAU) - Math.PI;
		if (diff < -Math.PI) diff += TAU;
		ant.a += Math.max(-amount, Math.min(amount, diff));
	}

	function step(dt) {
		const energy = 1;
		const room = ants.length < cap();
		for (const ant of ants) {
			ant.a += (Math.random() - 0.5) * 3.2 * dt;
			let boost = 1;

			const px = ant.x - pointer.x;
			const py = ant.y - pointer.y;
			const pd = Math.hypot(px, py);
			if (pd < 110) {
				steer(ant, Math.atan2(py, px), 9 * dt);
				boost = 2.6;
			} else if (room && ant.cool <= 0) {
				// Ants that are ready drift towards each other, so they do meet.
				let best = null;
				let bestD = 280;
				for (const other of ants) {
					if (other === ant || other.cool > 0) continue;
					const d = Math.hypot(other.x - ant.x, other.y - ant.y);
					if (d < bestD) {
						bestD = d;
						best = other;
					}
				}
				if (best) steer(ant, Math.atan2(best.y - ant.y, best.x - ant.x), 1.6 * dt);
			}

			const v = ant.speed * boost * energy * (0.6 + 0.4 * ant.size);
			ant.x += Math.cos(ant.a) * v * dt;
			ant.y += Math.sin(ant.a) * v * dt;
			ant.phase += v * dt * 0.45;
			ant.cool -= dt;
			ant.size += (1 - ant.size) * dt * 0.12;

			if (ant.x < -20) ant.x = width + 20;
			if (ant.x > width + 20) ant.x = -20;
			if (ant.y < -20) ant.y = height + 20;
			if (ant.y > height + 20) ant.y = -20;
		}

		if (!room) return;
		const born = [];
		for (let i = 0; i < ants.length; i++) {
			const a = ants[i];
			if (a.cool > 0) continue;
			for (let j = i + 1; j < ants.length; j++) {
				const b = ants[j];
				if (b.cool > 0 || Math.hypot(a.x - b.x, a.y - b.y) > 10) continue;
				a.cool = b.cool = 9;
				a.a += Math.PI * 0.6;
				b.a -= Math.PI * 0.6;
				born.push([(a.x + b.x) / 2, (a.y + b.y) / 2]);
				break;
			}
		}
		for (const [x, y] of born) {
			if (ants.length < cap()) spawn(x, y, 0.35, 12);
		}
		if (born.length) notify();
	}

	function draw() {
		ctx.clearRect(0, 0, width, height);
		ctx.lineCap = "round";
		for (const ant of ants) {
			ctx.save();
			ctx.translate(ant.x, ant.y);
			ctx.rotate(ant.a);
			ctx.scale(ant.size * 1.15, ant.size * 1.15);

			// A paper-coloured halo keeps ants readable on top of photographs.
			ctx.strokeStyle = paper;
			ctx.lineWidth = 2.4;
			ctx.beginPath();
			ctx.ellipse(-4.2, 0, 3.4, 2.3, 0, 0, TAU);
			ctx.ellipse(3.2, 0, 1.8, 1.6, 0, 0, TAU);
			ctx.stroke();

			ctx.strokeStyle = ink;
			ctx.fillStyle = ink;
			ctx.lineWidth = 0.8;
			ctx.beginPath();
			for (let i = -1; i <= 1; i++) {
				const swing = Math.sin(ant.phase + i * 2.1) * 1.4;
				ctx.moveTo(i * 1.6, 0);
				ctx.lineTo(i * 2.6 + swing, 4.6);
				ctx.moveTo(i * 1.6, 0);
				ctx.lineTo(i * 2.6 - swing, -4.6);
			}
			ctx.moveTo(4.2, 0.5);
			ctx.lineTo(7, 2.4);
			ctx.moveTo(4.2, -0.5);
			ctx.lineTo(7, -2.4);
			ctx.stroke();

			ctx.beginPath();
			ctx.ellipse(-4.2, 0, 3.2, 2.1, 0, 0, TAU);
			ctx.ellipse(0, 0, 1.9, 1.3, 0, 0, TAU);
			ctx.ellipse(3.2, 0, 1.7, 1.5, 0, 0, TAU);
			ctx.fill();
			ctx.restore();
		}
	}

	function frame(time) {
		const dt = Math.min((time - last) / 1000, 0.05);
		last = time;
		if (!paused && !document.hidden) {
			step(dt);
			draw();
		}
		requestAnimationFrame(frame);
	}

	function save() {
		try {
			sessionStorage.setItem(
				KEY,
				JSON.stringify(ants.map((a) => [a.x / width, a.y / height, +a.a.toFixed(2), +a.size.toFixed(2)])),
			);
		} catch {}
	}

	resize();
	try {
		const stored = JSON.parse(sessionStorage.getItem(KEY));
		if (Array.isArray(stored)) {
			for (const [x, y, a, size] of stored) {
				spawn(x * width, y * height, size, 4 + Math.random() * 6);
				ants.at(-1).a = a;
			}
		}
	} catch {}
	if (!ants.length && sessionStorage.getItem(KEY) === null) {
		spawnAtEdge();
		spawnAtEdge();
		for (const ant of ants) ant.cool = 2;
	}

	addEventListener("resize", resize);
	addEventListener("pointermove", (e) => {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
	});
	addEventListener("pointerleave", () => (pointer.x = pointer.y = -999));
	addEventListener("pagehide", save);
	requestAnimationFrame((t) => {
		last = t;
		draw();
		frame(t);
	});

	return {
		get list() {
			return ants;
		},
		get paused() {
			return paused;
		},
		setCount,
		setPaused(value) {
			paused = value;
			canvas.hidden = value;
		},
		onCount(fn) {
			listeners.add(fn);
			fn(ants.length);
		},
	};
}
