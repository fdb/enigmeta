import { html, render, useState, useEffect, useRef } from './preact-htm.module.js';

function Properties() {
	return html`<section class="properties"></section>`;
}

function Preview({ props }) {
	const canvasRef = useRef();
	const [isAnimating, setAnimating] = useState(true);

	function draw() {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const bounds = canvas.getBoundingClientRect();
		const width = bounds.width;
		const height = bounds.height;
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;
		ctx.resetTransform();
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		ctx.strokeStyle = '#581845';
		const horizontalLineAmount = Math.ceil(width / (props.cellWidth + props.cellPadding));
		const verticalLineAmount = Math.ceil(height / (props.cellHeight + props.cellPadding));
		for (let y = 0; y < height; y += props.cellHeight + props.cellPadding) {
			for (let x = 0; x < width; x += props.cellWidth + props.cellPadding) {
				const halfLine = typeof props.lineLength === 'function' ? props.lineLength(x, y) / 2 : props.lineLength / 2;
				ctx.save();
				ctx.translate(x + props.cellWidth / 2, y + props.cellHeight / 2);
				ctx.rotate(typeof props.cellRotation === 'function' ? props.cellRotation(x, y) : props.cellRotation);
				ctx.lineWidth = typeof props.lineWidth === 'function' ? props.lineWidth(x, y) : props.lineWidth;
				ctx.beginPath();
				ctx.moveTo(-halfLine, 0);
				ctx.lineTo(halfLine, 0);
				ctx.stroke();
				ctx.restore();
			}
		}
		if (isAnimating) {
			requestAnimationFrame(draw);
		}
	}

	useEffect(() => {
		if (isAnimating) {
			requestAnimationFrame(draw);
		}
	}, [isAnimating]);

	return html`<section class="preview"><canvas ref=${canvasRef} /></section>`;
}

function App() {
	const [props, setProps] = useState({
		cellWidth: 30,
		cellHeight: 30,
		cellPadding: 1,
		cellRotation: (x, y) =>
			Math.sin(x / 100.0 + Date.now() / 50000.0) + Math.cos(y / 100.0 + Date.now() / 3000) + ((Date.now() / 10000.0) % (2 * Math.PI)),
		lineWidth: (x, y) => Math.abs(Math.sin(x / 100.0) * 5) + 1,
		lineLength: 30 // (x, y) => Math.abs(Math.sin(Date.now() / 10000 + y / 100.0) * 10 + 10)
		// cellRotation: (x, y) => Math.sin(x / 100.0) + Math.cos(y / 100.0) + ((Date.now() / 10000.0) % (2 * Math.PI))
	});

	return html`<main><${Preview} props=${props} /><${Properties} props=${props} setProps=${setProps} /></main>`;
}

render(html`<${App} />`, document.body);
