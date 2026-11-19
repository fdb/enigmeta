// MacPaint on every card. Pick a pencil, spray can or eraser from the Tools
// menu and draw on the card in black. One paint pixel is two screen pixels.
// The drawing is kept in this browser, per card.

import { load, save } from "./state.js";

const SCALE = 2;
const MAX_HEIGHT = 6000;
const key = "paint:" + location.pathname;

let canvas, ctx, card, last;

function ensure() {
	if (canvas) return;
	card = document.querySelector("[data-card]");
	canvas = document.createElement("canvas");
	canvas.className = "paint";
	canvas.setAttribute("aria-hidden", "true");
	canvas.width = Math.ceil(card.clientWidth / SCALE);
	canvas.height = Math.ceil(Math.min(card.clientHeight, MAX_HEIGHT) / SCALE);
	canvas.style.width = canvas.width * SCALE + "px";
	canvas.style.height = canvas.height * SCALE + "px";
	card.append(canvas);
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	canvas.addEventListener("pointerdown", (e) => {
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {}
		last = point(e);
		stroke(last, last);
	});
	canvas.addEventListener("pointermove", (e) => {
		if (!last) return;
		const p = point(e);
		stroke(last, p);
		last = p;
	});
	const end = () => {
		if (!last) return;
		last = null;
		if (!save(key, canvas.toDataURL("image/png"))) save(key, null);
	};
	canvas.addEventListener("pointerup", end);
	canvas.addEventListener("pointercancel", end);
}

function point(e) {
	const box = canvas.getBoundingClientRect();
	return { x: Math.floor((e.clientX - box.left) / SCALE), y: Math.floor((e.clientY - box.top) / SCALE) };
}

function stroke(a, b) {
	const tool = document.documentElement.dataset.tool;
	const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
	ctx.fillStyle = "#000";
	for (let i = 0; i <= steps; i++) {
		const x = Math.round(a.x + ((b.x - a.x) * i) / steps);
		const y = Math.round(a.y + ((b.y - a.y) * i) / steps);
		if (tool === "pencil") ctx.fillRect(x, y, 1, 1);
		else if (tool === "eraser") ctx.clearRect(x - 4, y - 4, 9, 9);
		else if (tool === "spray") {
			for (let n = 0; n < 5; n++) {
				const r = Math.sqrt(Math.random()) * 9;
				const t = Math.random() * Math.PI * 2;
				ctx.fillRect(Math.round(x + Math.cos(t) * r), Math.round(y + Math.sin(t) * r), 1, 1);
			}
		}
	}
}

export function setTool(tool) {
	if (tool !== "browse") ensure();
	document.documentElement.dataset.tool = tool;
}

export function erase() {
	save(key, null);
	if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function restore() {
	const data = load(key);
	if (!data) return;
	ensure();
	const img = new Image();
	img.onload = () => ctx.drawImage(img, 0, 0);
	img.src = data;
}
