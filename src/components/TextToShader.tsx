import React, { useState } from "react";
import PresetSelector from "./ui/Examples";
import ShaderForm from "./ui/ShaderInput";
import ErrorDisplay from "./ui/ErrorBox";
import ShaderCanvas from "./ui/Canvas";
import ShaderCodeDisplay from "./ui/CodeBox";
import { useShaderAPI } from "../hooks/useShaderAPI";
import { useShaderExecution } from "../hooks/useShaderExecution";

interface ShaderPreset {
	name: string;
	prompt: string;
}
export const SHADER_PRESETS: ShaderPreset[] = [
	{
		name: "Color Cube Illusion",
		prompt: "a 2D shader creating the illusion of a rotating cube with color shifting faces and perspective effects",
	},
	{
		name: "Dynamic Shadow Play",
		prompt: "a 2D scene with abstract objects casting realistic dynamic shadows that move with time",
	},
	{
		name: "Liquid Metal Surface",
		prompt: "a shimmering liquid metal surface with realistic reflections and ripple effects",
	},
	{
		name: "Fire and Smoke",
		prompt: "animated 2D fire and smoke effect with realistic movement and color transitions",
	},
	{
		name: "Electric Current",
		prompt: "electric current or lightning bolts that jump between points with glow effects and blue-white colors",
	},
	{
		name: "Crystal Refraction",
		prompt: "a 2D crystal or glass effect with light refraction, rainbow patterns, and subtle animations",
	},
	{
		name: "Retro Pixel Art",
		prompt: "animated retro pixel art style shader with limited color palette and blocky transitions",
	},
	{
		name: "Cloth Simulation",
		prompt: "a 2D cloth or fabric simulation with realistic waving and folding movements responding to time",
	},
];

const MAX_FIX_ATTEMPTS = 3;

const TextToShader: React.FC = () => {
	const [prompt, setPrompt] = useState<string>("");
	const [fixAttempts, setFixAttempts] = useState<number>(0);

	const { shaderCode, isLoading, error, generateShader, fixShader, isFixing } = useShaderAPI();

	const { canvasRef, compilationError, executeShader } = useShaderExecution();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setFixAttempts(0); 
		const generatedCode = await generateShader(prompt);
		if (generatedCode) executeShader(generatedCode);
	};

	const handleFixShader = async () => {
		if (!compilationError || !shaderCode || fixAttempts >= MAX_FIX_ATTEMPTS)
			return;

		const fixedCode = await fixShader(shaderCode, compilationError);
		if (fixedCode) {
			setFixAttempts((prev) => prev + 1);
			executeShader(fixedCode);
		}
	};

	return (
		<div className="space-y-6">
			   <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-purple-400">Text-to-Shader Generator</h2>
      </div>

			<PresetSelector
				presets={SHADER_PRESETS}
				onPresetSelect={setPrompt}
			/>

			<ShaderForm
				prompt={prompt}
				setPrompt={setPrompt}
				onSubmit={handleSubmit}
				isLoading={isLoading}
				isFixing={isFixing}
			/>

			{error && <ErrorDisplay message={error} />}

			<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm">
				<ShaderCanvas ref={canvasRef} />

				{compilationError && (
					<ErrorDisplay
						title="Shader Compilation Error:"
						message={compilationError}
						isCompilationError={true}
						onFixAttempt={handleFixShader}
						isFixing={isFixing}
					/>
				)}

				{shaderCode && <ShaderCodeDisplay code={shaderCode} />}
			</div>

			{compilationError && fixAttempts >= MAX_FIX_ATTEMPTS && (
				<p className="text-red-400 text-sm mt-2 text-center">
					Max fix attempts reached. Try generating a new shader.
				</p>
			)}
		</div>
	);
};

export default TextToShader;
