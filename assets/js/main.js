import { cardIndex, load, save, stack } from "./state.js";
import { startAnts } from "./ants.js";
import { erase, restore, setTool } from "./paint.js";

const root = document.documentElement;
const $ = (selector) => document.querySelector(selector);
const typing = (target) => target.closest?.("input, textarea, [contenteditable]");

// ----- Menus: one open at a time, closed by a click elsewhere or Escape -----
const menus = [...document.querySelectorAll(".menu")];
const closeMenus = () => menus.forEach((menu) => (menu.open = false));
document.addEventListener("click", (e) => {
	if (!e.target.closest(".menu") || e.target.closest(".menu-items a, .menu-items button")) closeMenus();
});
// Slide from one open menu to the next, like a real menu bar.
for (const menu of menus) {
	menu.querySelector("summary").addEventListener("pointerenter", () => {
		if (menus.some((other) => other.open && other !== menu)) {
			closeMenus();
			menu.open = true;
		}
	});
}

// ----- Clock -----
const clock = $("[data-clock]");
if (clock) {
	const tick = () => (clock.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
	tick();
	setInterval(tick, 20000);
}

// ----- Ants -----
const ants = startAnts();
function setAnts(on) {
	ants.setPaused(!on);
	if (on && !ants.list.length) ants.setCount(2);
	save("ants", on ? "1" : "0");
	check("ants", on);
}

// ----- Options -----
function check(action, on) {
	const item = $(`[data-action="${action}"]`);
	item?.setAttribute("role", "menuitemcheckbox");
	item?.setAttribute("aria-checked", on);
}
function invert() {
	const on = root.toggleAttribute("data-invert");
	save("invert", on ? "1" : "0");
	check("invert", on);
}
function toggleEffects() {
	const off = root.toggleAttribute("data-no-effects");
	save("effects", off ? "0" : "1");
	check("effects", !off);
}
function tool(name) {
	setTool(name);
	for (const item of document.querySelectorAll("[data-tool]")) {
		item.setAttribute("role", "menuitemradio");
		item.setAttribute("aria-checked", item.dataset.tool === name);
	}
}

const actions = {
	invert,
	ants: () => setAnts(ants.paused),
	effects: toggleEffects,
	erase,
};
document.addEventListener("click", (e) => {
	const action = e.target.closest("[data-action]")?.dataset.action;
	if (action) actions[action]?.();
	const picked = e.target.closest("[data-tool]")?.dataset.tool;
	if (picked) tool(picked);
});

// ----- Keys: arrows flip cards -----
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeMenus();
		if (root.dataset.tool && root.dataset.tool !== "browse") tool("browse");
		return;
	}
	if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
	if (cardIndex >= 0 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
		const n = stack.length;
		location.href = stack[(cardIndex + (e.key === "ArrowRight" ? 1 : n - 1)) % n][1];
	}
});

// ----- Initial state -----
check("invert", root.hasAttribute("data-invert"));
check("effects", !root.hasAttribute("data-no-effects"));
check("ants", !ants.paused);
if (load("ants") === "0") setAnts(false);
tool("browse");
restore();

// ----- Pictures that fail to load say so -----
document.addEventListener(
	"error",
	(e) => {
		const img = e.target;
		if (!(img instanceof HTMLImageElement) || !img.closest(".prose")) return;
		const note = document.createElement("span");
		note.className = "missing";
		note.textContent = `This picture is missing${img.alt ? ": " + img.alt : "."}`;
		img.replaceWith(note);
	},
	true,
);

const maze = $("[data-maze]");
if (maze) import("./maze.js").then((m) => m.startMaze(maze));
