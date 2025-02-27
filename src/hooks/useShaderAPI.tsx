import { useState } from "react";
import { generateShaderAPI, fixShaderAPI } from "../service";

export const useShaderAPI = () => {
	const [shaderCode, setShaderCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isFixing, setIsFixing] = useState<boolean>(false);

	const generateShader = async (description: string): Promise<string | null> => {
		if (!description.trim()) {
			setError("Please enter a description.");
			return null;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await generateShaderAPI(description);
			const cleanedShader = data.shader.replace(/```(glsl|)\n?/g, "").trim();
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

	const fixShader = async (code: string, errorMessage: string): Promise<string | null> => {
		setIsFixing(true);

		try {
			const data = await fixShaderAPI(code, errorMessage);
			const cleanedShader = data.shader.replace(/```(glsl|)\n?/g, "").trim();
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
