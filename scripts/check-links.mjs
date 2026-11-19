#!/usr/bin/env node

/**
 * Checks the built site in _site: every local href and src must resolve to a file.
 * Usage:
 *   node scripts/check-links.mjs
 * Pages under SKIP are a vendored third-party test suite with links of its own.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = "_site";
const SKIP = "_site/presentation/syntaxhighlighter/";

function* htmlFiles(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* htmlFiles(full);
		else if (entry.name.endsWith(".html")) yield full;
	}
}

function exists(url) {
	const clean = decodeURI(url.split(/[?#]/)[0]);
	const target = path.join(ROOT, clean);
	if (clean.endsWith("/")) return fs.existsSync(path.join(target, "index.html"));
	return fs.existsSync(target);
}

const broken = [];
let checked = 0;
for (const file of htmlFiles(ROOT)) {
	if (file.startsWith(SKIP)) continue;
	const html = fs.readFileSync(file, "utf8");
	for (const [, url] of html.matchAll(/\b(?:href|src|poster)="(\/[^"/][^"]*|\/)"/g)) {
		checked++;
		if (!exists(url)) broken.push(`${file}: ${url}`);
	}
}

console.log(`Checked ${checked} local links in ${ROOT}.`);
if (broken.length) {
	console.error(`${broken.length} broken:\n` + broken.join("\n"));
	process.exit(1);
}
console.log("No broken local links.");
