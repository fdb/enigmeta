// Small shared helpers.

export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function load(key, fallback = null) {
	try {
		return localStorage.getItem(key) ?? fallback;
	} catch {
		return fallback;
	}
}

export function save(key, value) {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}

// The stack: every card as [title, url], in order.
export const stack = JSON.parse(document.getElementById("stack")?.textContent || "[]");
export const cardIndex = stack.findIndex(([, url]) => url === location.pathname);
