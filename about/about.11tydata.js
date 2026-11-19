const { dither } = require('../lib/dither.js');

module.exports = {
	eleventyComputed: {
		portrait: () => dither('/media/img/frederik-de-bleser.jpg', 160, 200, { position: 'centre', gamma: 1 }),
	},
};
