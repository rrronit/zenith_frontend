// components/TextToShader.jsx
import React, { useState, useEffect, useRef } from "react";

const TextToShader = () => {
	const [prompt, setPrompt] = useState("");
	const [shaderCode, setShaderCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<String | null>(null);
	const canvasRef = useRef(null);

	return (
		<div>
			<h2>Text-to-Shader Generator</h2>
			<p>Describe</p>

			<form>
				<div>
					<input
						type="text"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
					/>
					<button type="submit" disabled={isLoading}>
						{isLoading ? "Generating..." : "Generate Shader"}
					</button>
				</div>
			</form>

			{error && <div>{error}</div>}

			<div>
				<div>
					<canvas ref={canvasRef} width={512} height={512} />
				</div>
			</div>
		</div>
	);
};

export default TextToShader;
