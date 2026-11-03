const crypto = require('node:crypto');
const fs = require('node:fs');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const site = require('./_data/site.json');

module.exports = async function (eleventyConfig) {
	const { feedPlugin } = await import('@11ty/eleventy-plugin-rss');

	// Append a hash of the file so browsers refetch it only when it changes.
	eleventyConfig.addFilter('versioned', (url) => {
		const hash = crypto.createHash('md5').update(fs.readFileSync(`.${url}`)).digest('hex').slice(0, 8);
		return `${url}?v=${hash}`;
	});

	eleventyConfig.addPassthroughCopy('media');
	eleventyConfig.addPassthroughCopy('favicon.ico');
	eleventyConfig.addPassthroughCopy('robots.txt');
	// Hand-built pages keep their scripts, images and fonts next to them.
	for (const dir of ['codevember', 'doodles', 'experiments', 'images', 'presentation', 'thesis']) {
		eleventyConfig.addPassthroughCopy(`${dir}/**/*.{js,css,png,jpg,jpeg,gif,svg,ico,ogg,otf,ttf,woff,woff2,coffee,htc}`);
	}
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(feedPlugin, {
		type: 'atom',
		outputPath: '/atom.xml',
		collection: { name: 'post' },
		metadata: {
			language: 'en',
			title: 'Enigmeta',
			subtitle: 'Writing by Frederik De Bleser, designer, researcher and teacher at Sint Lucas Antwerpen.',
			base: `${site.url}/`,
			author: { name: 'Frederik De Bleser' },
		},
	});
};
