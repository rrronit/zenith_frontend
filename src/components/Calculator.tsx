import { useState, useEffect } from "react";

declare global {
	interface Window {
		rustCalculator: {
			calculate: (expression: string) => number;
		};
	}
}

type CalculatorState = {
	expression: string;
	result: number | null;
	error: string | null;
	wasmLoaded: boolean;
};

function Calculator() {
	const [state, setState] = useState<CalculatorState>({
		expression: "",
		result: null,
		error: null,
		wasmLoaded: false,
	});

	const { expression, result, error, wasmLoaded } = state;

	useEffect(() => {
		async function loadWasm() {
			try {
				const rustModule = await import("../wasm/pkg/wasm.js");
				await rustModule.default();
				window.rustCalculator = rustModule;
				setState((prev) => ({ ...prev, wasmLoaded: true }));
			} catch (err) {
				console.error("Failed to load WASM module:", err);
				setState((prev) => ({
					...prev,
					error: "Failed to load calculator. Please try again later.",
				}));
			}
		}

		loadWasm();
	}, []);

	const updateExpression = (value: string) => {
		setState((prev) => ({ ...prev, expression: value }));
	};

	const setExampleExpression = (example: string) => {
		setState((prev) => ({ ...prev, expression: example }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!wasmLoaded) {
			setState((prev) => ({
				...prev,
				error: "Calculator is still loading. Please wait...",
			}));
			return;
		}

		try {
			const calculationResult =
				window.rustCalculator.calculate(expression);
			setState((prev) => ({
				...prev,
				result: calculationResult,
				error: null,
			}));
		} catch (err) {
			console.error("Calculation error:", err);
			setState((prev) => ({
				...prev,
				error: err as string,
				result: null,
			}));
		}
	};

	return (
		<div className="space-y-6 p-6 bg-gray-900 rounded-xl">
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-semibold text-purple-400">
					Calculator
				</h2>
			</div>

			<div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
				<p className="text-gray-300 text-sm mb-2">
					Try these expressions:
				</p>
				<div className="grid grid-cols-2 gap-2 text-gray-400 text-sm">
					{["42 - 17 + 8", "6 * 7 / 2", "(3 + 5) * 2", "3.14 * (10 - 2) / 4",].map((example) => (
						<button
							onClick={() => setExampleExpression(example)}
							className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md text-center hover:bg-gray-650 transition-colors"
						>
							{example}
						</button>
					))}
				</div>

				<div className="mt-3 pt-3 border-t border-gray-700">
					<p className="text-gray-300 text-sm mb-2">
						Or try these tricky ones:
					</p>
					<div className="grid grid-cols-2 gap-2 text-gray-400 text-sm">
						{["1/0", "2^8", "3++4", ")5+2("].map((example) => (
							<button
								onClick={() => setExampleExpression(example)}
								className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md text-center hover:bg-gray-650 transition-colors"
							>
								{example}
							</button>
						))}
					</div>
				</div>

				<p className="text-purple-400/75 text-xs mt-3 text-center">
					Or try breaking it on purpose! <code>3++2</code>,{" "}
					<code>)5+2(</code>—see what happens! 🤯
				</p>
			</div>

			{/* Input Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={expression}
						onChange={(e) => updateExpression(e.target.value)}
						placeholder="Enter a math expression..."
						aria-label="Math expression"
						className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					/>
					<button
						type="submit"
						disabled={!wasmLoaded}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							wasmLoaded
								? "bg-purple-600 hover:bg-purple-700 text-white"
								: "bg-gray-700 text-gray-400 cursor-not-allowed"
						}`}
					>
						Calculate
					</button>
				</div>
			</form>

			{/* Result or Error Message */}
			{error && (
				<div
					className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-300 text-sm text-center"
					role="alert"
				>
					<p>{error}</p>
				</div>
			)}

			{result !== null && !error && (
				<div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
					<div className="text-gray-400 text-sm">{expression} =</div>
					<div
						className="text-2xl font-semibold text-purple-400"
						aria-live="polite"
					>
						{result}
					</div>
				</div>
			)}

			{/* Loading Indicator */}
			{!wasmLoaded && (
				<div
					className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 flex items-center space-x-2 justify-center"
					aria-live="polite"
				>
					<div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-purple-400 animate-spin"></div>
					<span>Loading calculator...</span>
				</div>
			)}
		</div>
	);
}

export default Calculator;
