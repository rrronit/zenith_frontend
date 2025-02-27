const BASE_API = "https://backend.ronit.tech/api";

export const generateShaderAPI = async (description: string) => {
	const response = await fetch(`${BASE_API}/generate-shader`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ description }),
	});
	if (!response.ok) {
		throw new Error(`Server responded with ${response.status}`);
	}
	return response.json();
};

export const fixShaderAPI = async (code: string, errorMessage: string) => {
	const response = await fetch(`${BASE_API}/fix-shader`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code, error: errorMessage }),
	});
	if (!response.ok) {
		throw new Error(`Server responded with ${response.status}`);
	}
	return response.json();
};
