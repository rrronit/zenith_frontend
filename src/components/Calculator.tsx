import { useState } from "react";

type CalculatorState = {
	expression: string;
	result: number | null;
	error: string | null;
	wasmLoaded: boolean;
};

const Calculator = () => {
	const [state, setState] = useState<CalculatorState>({
		expression: "",
		result: null,
		error: null,
		wasmLoaded: false,
	});

	const { expression, result, error, wasmLoaded } = state;

	return (
		<div>
			<h2>Wasm Calculator</h2>

			<p>
				Enter a mathematical expression (e.g., 2+2, 3*4, (5+7)/2) and
				see it calculated using Rust/WebAssembly!
			</p>

			<form>
				<div>
					<input
						type="text"
						value={expression}
						onChange={(_e) => {}}
					/>
					<button type="submit" disabled={!wasmLoaded}>
						Calculate
					</button>
				</div>
			</form>

			{error && <div>{error}</div>}
		</div>
	);
};

export default Calculator;
