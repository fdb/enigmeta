// Build-time 1-bit pictures. Atkinson dithering is the algorithm MacPaint and
// HyperCard-era scanners used: it only spreads 6/8 of the error, which keeps
// highlights and shadows clean and gives the look its contrast.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const OUT = "_site/dither";
const cache = new Map();

function dither(src, width, height, options = {}) {
	const key = `${src}|${width}|${height}|${JSON.stringify(options)}`;
	if (!cache.has(key)) cache.set(key, run(src, width, height, key, options));
	return cache.get(key);
}

async function run(src, width, height, key, { position = "attention", gamma = 1.6 } = {}) {
	const input = "." + src;
	if (!fs.existsSync(input)) return null;
	const stat = fs.statSync(input);
	const name = crypto.createHash("sha1").update(`${key}|${stat.size}|${stat.mtimeMs}`).digest("hex").slice(0, 12);
	const url = `/dither/${name}.png`;
	const output = path.join(OUT, `${name}.png`);
	if (fs.existsSync(output)) return url;

	let image = sharp(input, { animated: false })
		.resize(width, height, { fit: "cover", position })
		.flatten({ background: "#fff" })
		.greyscale()
		.normalise();
	if (gamma > 1) image = image.gamma(gamma);
	const { data } = await image
		.raw()
		.toBuffer({ resolveWithObject: true });

	const px = Float32Array.from(data);
	const out = Buffer.alloc(width * height);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = y * width + x;
			const value = px[i] < 128 ? 0 : 255;
			const err = (px[i] - value) / 8;
			out[i] = value;
			if (x + 1 < width) px[i + 1] += err;
			if (x + 2 < width) px[i + 2] += err;
			if (y + 1 < height) {
				if (x > 0) px[i + width - 1] += err;
				px[i + width] += err;
				if (x + 1 < width) px[i + width + 1] += err;
			}
			if (y + 2 < height) px[i + 2 * width] += err;
		}
	}

	fs.mkdirSync(OUT, { recursive: true });
	await sharp(out, { raw: { width, height, channels: 1 } }).png({ colours: 2 }).toFile(output);
	return url;
}

module.exports = { dither };
