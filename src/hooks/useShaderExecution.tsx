import { useRef, useState, useEffect } from "react";

export const useShaderExecution = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const glRef = useRef<WebGLRenderingContext | null>(null);
	const programRef = useRef<WebGLProgram | null>(null);
	const frameIdRef = useRef<number>(0);
	const startTimeRef = useRef<number>(performance.now());

	const [compilationError, setCompilationError] = useState<string | null>(
		null
	);
	const [isRunning, setIsRunning] = useState<boolean>(false);

	useEffect(() => {
		return () => {
			if (frameIdRef.current) {
				cancelAnimationFrame(frameIdRef.current);
			}

			if (glRef.current && programRef.current) {
				glRef.current.deleteProgram(programRef.current);
			}
		};
	}, []);

	const createShader = (
		gl: WebGLRenderingContext,
		type: number,
		source: string
	): WebGLShader | null => {
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw new Error(`Shader compilation error: ${info}`);
		}

		return shader;
	};

	const createProgram = (
		gl: WebGLRenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram | null => {
		const program = gl.createProgram();
		if (!program) return null;

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			gl.deleteProgram(program);
			throw new Error(`Program linking error: ${info}`);
		}

		return program;
	};

	const createQuadBuffer = (
		gl: WebGLRenderingContext
	): WebGLBuffer | null => {
		// Create a buffer for a single quad covering the entire canvas
		const vertices = new Float32Array([
			-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
		]);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		return buffer;
	};

	const parseShaderCode = (
		shaderCode: string
	): { vertexShader: string; fragmentShader: string } => {
		const vertexMatch = shaderCode.match(
			/\/\/ VERTEX SHADER\s+([\s\S]+?)(?=\/\/ FRAGMENT SHADER)/
		);
		const fragmentMatch = shaderCode.match(
			/\/\/ FRAGMENT SHADER\s+([\s\S]+)/
		);

		if (!vertexMatch || !fragmentMatch) {
			throw new Error("Couldn't parse vertex and fragment shaders");
		}

		return {
			vertexShader: vertexMatch[1],
			fragmentShader: fragmentMatch[1],
		};
	};

	const executeShader = (shaderCode: string) => {
		if (frameIdRef.current) {
			cancelAnimationFrame(frameIdRef.current);
		}

		setCompilationError(null);

		const canvas = canvasRef.current;
		if (!canvas) {
			setCompilationError("Canvas not available");
			return;
		}

		try {
			const gl = canvas.getContext("webgl");
			if (!gl) {
				throw new Error("WebGL not supported");
			}
			glRef.current = gl;

			const { vertexShader, fragmentShader } =
				parseShaderCode(shaderCode);

			const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
			const fragShader = createShader(
				gl,
				gl.FRAGMENT_SHADER,
				fragmentShader
			);

			if (!vertShader || !fragShader) {
				throw new Error("Failed to create shaders");
			}

			const program = createProgram(gl, vertShader, fragShader);
			if (!program) {
				throw new Error("Failed to create program");
			}

			if (programRef.current) {
				gl.deleteProgram(programRef.current);
			}
			programRef.current = program;

			const quadBuffer = createQuadBuffer(gl);
			if (!quadBuffer) {
				throw new Error("Failed to create buffer");
			}

			const positionLocation = gl.getAttribLocation(program, "position");
			const timeLocation = gl.getUniformLocation(program, "time");
			const resolutionLocation = gl.getUniformLocation(
				program,
				"resolution"
			);

			const render = () => {
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
					gl.viewport(0, 0, width, height);
				}

				gl.useProgram(program);

				gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
				gl.enableVertexAttribArray(positionLocation);
				gl.vertexAttribPointer(
					positionLocation,
					2,
					gl.FLOAT,
					false,
					0,
					0
				);

				const currentTime =
					(performance.now() - startTimeRef.current) / 1000.0;
				gl.uniform1f(timeLocation, currentTime);
				gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

				frameIdRef.current = requestAnimationFrame(render);
			};

			startTimeRef.current = performance.now();
			frameIdRef.current = requestAnimationFrame(render);
			setIsRunning(true);
		} catch (error) {
			if (error instanceof Error) {
				setCompilationError(error.message);
			} else {
				setCompilationError("Unknown error occurred");
			}
			setIsRunning(false);
		}
	};

	const stopExecution = () => {
		if (frameIdRef.current) {
			cancelAnimationFrame(frameIdRef.current);
			setIsRunning(false);
		}
	};

	return {
		canvasRef,
		compilationError,
		isRunning,
		executeShader,
		stopExecution,
	};
};
