const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const site = require('./_data/site.json');

module.exports = async function (eleventyConfig) {
	const { feedPlugin } = await import('@11ty/eleventy-plugin-rss');

	eleventyConfig.addPassthroughCopy('media');
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
