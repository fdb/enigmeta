const VERTEX_SHADER = `
  attribute vec4 a_position; // a_position will now be (x, y, cx, cy)
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    // Extract the vertex and cell center coordinates
    vec2 position = a_position.xy;
    vec2 center = a_position.zw;

    // Compute the rotation angle
    float rotation = sin(center.x / 100.0 + u_time / 2.0) + cos(center.y / 100.0 + u_time / 10.0);

    // Rotate around the cell center
    float cosRot = cos(rotation);
    float sinRot = sin(rotation);
    vec2 rotatedPosition = vec2(
      cosRot * (position.x - center.x) - sinRot * (position.y - center.y) + center.x,
      sinRot * (position.x - center.x) + cosRot * (position.y - center.y) + center.y
    );

    // Convert from pixels to clip space
    vec2 zeroToOne = rotatedPosition / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    // Flip the Y axis to make the origin at the bottom-left
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

const FRAGMENT_SHADER = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

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
		this.gl = this.canvas.getContext('webgl');
		this.props = {
			cellWidth: 50,
			cellHeight: 50,
			cellPadding: 2,
			lineLength: 50,
			lineWidth: 2
		};
		this.draw = this.draw.bind(this);
		this.resize = this.resize.bind(this);
		this.resizeObserver = new ResizeObserver(this.resize);
		this.program = null;
		this.vertexBuffer = null;
		this.setupShaders();
		this.resize();
		this.setupBuffer();
		this.startTime = Date.now() / 1000;
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
		this.width = bounds.width;
		this.height = bounds.height;
		canvas.width = this.width * window.devicePixelRatio;
		canvas.height = this.height * window.devicePixelRatio;
		this.setupBuffer();
	}

	setupShaders() {
		const gl = this.gl;
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, VERTEX_SHADER);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(vertexShader));
			return;
		}
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, FRAGMENT_SHADER);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(fragmentShader));
			return;
		}
		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			console.error(gl.getProgramInfoLog(this.program));
			return;
		}
	}

	setupBuffer() {
		const gl = this.gl;
		const { cellWidth, cellHeight, cellPadding, lineLength, lineWidth } = this.props;
		if (this.vertexBuffer) {
			gl.deleteBuffer(this.vertexBuffer);
		}
		if (this.width === 0 || this.height === 0) return;
		const cols = Math.ceil(this.width / (cellWidth + cellPadding));
		const rows = Math.ceil(this.height / (cellHeight + cellPadding));
		const numLines = cols * rows;
		const vertices = new Float32Array(numLines * 6 * 4); // 6 vertices per line (2 triangles), each vertex has 4 coordinates (x, y, cx, cy)
		let index = 0;
		for (let y = 0; y < this.height; y += cellHeight + cellPadding) {
			for (let x = 0; x < this.width; x += cellWidth + cellPadding) {
				const cx = x + cellWidth / 2;
				const cy = y + cellHeight / 2;
				const left_x = cx - lineLength / 2;
				const right_x = cx + lineLength / 2;
				const top_y = cy - lineWidth / 2;
				const bottom_y = cy + lineWidth / 2;

				// Line vertices (two triangles)
				// Triangle 1: (x1, y1), (x2, y2), (x3, y3)
				vertices[index++] = left_x; // x1
				vertices[index++] = top_y; // y1
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy
				vertices[index++] = right_x; // x2
				vertices[index++] = top_y; // y2
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy
				vertices[index++] = right_x; // x3
				vertices[index++] = bottom_y; // y3
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy

				// Triangle 2: (x3, y3), (x4, y4), (x1, y1)
				vertices[index++] = right_x; // x3
				vertices[index++] = bottom_y; // y3
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy
				vertices[index++] = left_x; // x4
				vertices[index++] = bottom_y; // y4
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy
				vertices[index++] = left_x; // x1
				vertices[index++] = top_y; // y1
				vertices[index++] = cx; // cx
				vertices[index++] = cy; // cy
			}
		}

		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		this.vertexBuffer = vertexBuffer;
		this.vertexBuffer.numVertices = vertices.length / 4;
	}

	draw() {
		// console.log('draw');
		const canvas = this.canvas;
		const gl = this.gl;
		const props = this.props;

		gl.viewport(0, 0, canvas.width, canvas.height);
		// gl.clearColor(1, 1, 1, 1);
		// gl.clear(gl.COLOR_BUFFER_BIT);
		//
		if (this.vertexBuffer) {
			gl.useProgram(this.program);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			const positionLocation = gl.getAttribLocation(this.program, 'a_position');
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
			const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
			gl.uniform2f(resolutionLocation, this.width, this.height);
			const timeLocation = gl.getUniformLocation(this.program, 'u_time');
			gl.uniform1f(timeLocation, Date.now() / 1000 - this.startTime);
			gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numVertices);
		}

		requestAnimationFrame(this.draw);
	}
}

customElements.define('pattern-component', PatternComponent);
