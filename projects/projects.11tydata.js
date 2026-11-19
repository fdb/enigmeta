const { dither } = require('../lib/dither.js');

module.exports = {
	eleventyComputed: {
		image: (data) => (data.thumbnail ? `/media/projects/${data.slug}/${data.thumbnail}` : null),
		icon: (data) => (data.image ? dither(data.image, 144, 81) : null),
	},
};
