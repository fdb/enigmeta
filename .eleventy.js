const crypto = require('node:crypto');
const fs = require('node:fs');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const site = require('./_data/site.json');

const newestFirst = (a, b) => b.date - a.date || a.inputPath.localeCompare(b.inputPath);

module.exports = async function (eleventyConfig) {
	const { feedPlugin } = await import('@11ty/eleventy-plugin-rss');
	const { eleventyImageTransformPlugin } = await import('@11ty/eleventy-img');

	// The older posts write code as indented blocks, which Eleventy turns off by default.
	eleventyConfig.amendLibrary('md', (md) => md.enable('code'));

	// Append a hash of the file so browsers refetch it only when it changes.
	eleventyConfig.addFilter('versioned', (url) => {
		const hash = crypto.createHash('md5').update(fs.readFileSync(`.${url}`)).digest('hex').slice(0, 8);
		return `${url}?v=${hash}`;
	});

	eleventyConfig.addPassthroughCopy('media');
	eleventyConfig.addPassthroughCopy('assets');
	eleventyConfig.addPassthroughCopy({
		'node_modules/@fontsource/jersey-15/files/jersey-15-latin-400-normal.woff2': 'assets/fonts/jersey-15.woff2',
	});
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

	eleventyConfig.addCollection('posts', (api) => api.getFilteredByTag('post').sort(newestFirst));
	eleventyConfig.addCollection('projects', (api) => api.getFilteredByTag('project').sort(newestFirst));
	// The whole site is one stack of cards, in this order.
	eleventyConfig.addCollection('stack', (api) => {
		const all = api.getAll();
		const at = (url) => all.find((item) => item.url === url);
		const byTag = (tag) => api.getFilteredByTag(tag).sort(newestFirst);
		return [at('/'), at('/projects/'), ...byTag('project'), at('/posts/'), ...byTag('post'), at('/about/')].filter(Boolean);
	});
	eleventyConfig.addFilter('cardInfo', (stack, url) => {
		const i = stack.findIndex((item) => item.url === url);
		if (i < 0) return { number: 0, total: stack.length };
		return { number: i + 1, total: stack.length, prev: stack.at(i - 1), next: stack[(i + 1) % stack.length] };
	});
	eleventyConfig.addFilter('stackJson', (stack) =>
		JSON.stringify(stack.map((item) => [item.data.title, item.url])).replace(/</g, '\\u003c'),
	);

	eleventyConfig.addFilter('year', (date) => date.getUTCFullYear());
	eleventyConfig.addFilter('monthYear', (date) => date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }));
	eleventyConfig.addFilter('longDate', (date) =>
		date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', timeZone: 'UTC' }),
	);
	eleventyConfig.addFilter('isoDate', (date) => date.toISOString().slice(0, 10));
	eleventyConfig.addFilter('excerpt', (html, length = 170) => {
		const text = String(html || '')
			.replace(/<(style|script|pre|figure)[\s\S]*?<\/\1>/g, ' ')
			.replace(/<[^>]+>/g, ' ')
			.replace(/&amp;/g, '&')
			.replace(/&quot;|&#34;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/\s+/g, ' ')
			.trim();
		if (text.length <= length) return text;
		return text.slice(0, text.lastIndexOf(' ', length)).replace(/[,;:.]$/, '') + '…';
	});
	eleventyConfig.addFilter('byYear', (items) => {
		const groups = [];
		for (const item of items) {
			const year = item.date.getUTCFullYear();
			if (!groups.length || groups.at(-1).year !== year) groups.push({ year, items: [] });
			groups.at(-1).items.push(item);
		}
		return groups;
	});

	// Every local <img> is resized to a few widths and served as WebP with a
	// srcset. One format keeps the markup a plain <img>, so the style blocks
	// inside old posts keep matching. Originals are still copied.
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ['webp'],
		widths: [240, 480, 960, 1600],
		urlPath: '/img/',
		failOnError: false,
		sharpOptions: { animated: true },
		htmlOptions: {
			imgAttributes: { loading: 'lazy', decoding: 'async', sizes: '(min-width: 60rem) 944px, 100vw' },
		},
	});
};
