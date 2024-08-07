class PatternComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.canvas = document.createElement('canvas');
		const style = document.createElement('style');
		style.textContent = `
					:host {
						display: block;
						width: 100%;
						height: 500px; /* Default height */
					}
					canvas {
						width: 100%;
						height: 100%;
						overflow: hidden;
						background-color: #ffc300;
					}
				`;
		this.shadowRoot.append(style, this.canvas);
		this.ctx = this.canvas.getContext('2d');
		this.props = {
			cellWidth: 30,
			cellHeight: 30,
			cellPadding: 1,
			cellRotation: (x, y) =>
				Math.sin(x / 100.0 + Date.now() / 50000.0) + Math.cos(y / 100.0 + Date.now() / 3000) + ((Date.now() / 10000.0) % (2 * Math.PI)),
			lineLength: 30,
			lineWidth: 3
		};
		this.draw = this.draw.bind(this);
		this.resize = this.resize.bind(this);
		this.resizeObserver = new ResizeObserver(this.resize);
	}

	connectedCallback() {
		this.resizeObserver.observe(this);
		requestAnimationFrame(this.draw);
	}

	disconnectedCallback() {
		this.resizeObserver.unobserve(this);
		cancelAnimationFrame(this.draw);
	}

	resize() {
		const canvas = this.canvas;
		const bounds = this.getBoundingClientRect();
		const width = bounds.width;
		const height = bounds.height;
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;
	}

	draw() {
		const canvas = this.canvas;
		const ctx = this.ctx;
		const props = this.props;

		ctx.resetTransform();
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;
		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = '#581845';
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
		requestAnimationFrame(this.draw);
	}
}

customElements.define('pattern-component', PatternComponent);
