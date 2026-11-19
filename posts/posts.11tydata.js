const fs = require('node:fs');
const { dither } = require('../lib/dither.js');

function bigshot(data) {
	const dir = `/media/blog/${data.page.fileSlug}`;
	const names = [data.bigshot, 'bigshot.jpg', 'bigshot.png'].filter(Boolean);
	const name = names.find((n) => fs.existsSync(`.${dir}/${n}`));
	return name ? `${dir}/${name}` : null;
}

module.exports = {
	eleventyComputed: {
		image: bigshot,
		icon: (data) => (data.image ? dither(data.image, 64, 64) : null),
	},
};
