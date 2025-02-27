import { useState } from "react";

export const useShaderAPI = () => {
	const [shaderCode, setShaderCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isFixing, setIsFixing] = useState<boolean>(false);

	const generateShader = async (
		description: string
	): Promise<string | null> => {
		if (!description.trim()) {
			setError("Please enter a description.");
			return null;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				"http://localhost:4000/api/generate-shader",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ description }),
				}
			);

			if (!response.ok) {
				throw new Error(`Server responded with ${response.status}`);
			}

			const data = await response.json();
			const cleanedShader = data.shader
				.replace(/```(glsl|)\n?/g, "")
				.trim();
			setShaderCode(cleanedShader);
			return cleanedShader;
		} catch (err) {
			console.error("Error fetching shader:", err);
			setError("Failed to generate shader. Please try again.");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	const fixShader = async (
		code: string,
		errorMessage: string
	): Promise<string | null> => {
		setIsFixing(true);

		try {
			const response = await fetch(
				"http://localhost:4000/api/fix-shader",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						code,
						error: errorMessage,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`Server responded with ${response.status}`);
			}

			const data = await response.json();
			const cleanedShader = data.shader
				.replace(/```(glsl|)\n?/g, "")
				.trim();
			setShaderCode(cleanedShader);
			return cleanedShader;
		} catch (err) {
			console.error("Error fixing shader:", err);
			setError("Failed to fix shader. Please try again.");
			return null;
		} finally {
			setIsFixing(false);
		}
	};

	return {
		shaderCode,
		isLoading,
		error,
		isFixing,
		generateShader,
		fixShader,
	};
};
