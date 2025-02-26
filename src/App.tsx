import { useState } from "react";
import Calculator from "./components/Calculator";
import TextToShader from "./components/TextToShader";

function App() {
	const [activeTab, setActiveTab] = useState("calculator");

	const tabs = [
		{ id: "calculator", label: "Calculator" },
		{ id: "shader", label: "Shader" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "calculator":
				return <Calculator />;
			case "shader":
				return <TextToShader />;
			default:
				return <Calculator />;
		}
	};

	return (
		<div className="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
						Zenith
					</h1>

					<nav className="border-b border-slate-200 dark:border-slate-700">
						<div className="flex">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all duration-200
                    ${
						activeTab === tab.id
							? "bg-white dark:bg-slate-800 border-t border-l border-r border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
							: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-blue-500 dark:hover:text-blue-400"
					}`}
									onClick={() => setActiveTab(tab.id)}
									aria-selected={activeTab === tab.id}
								>
									{tab.label}
								</button>
							))}
						</div>
					</nav>
				</header>

				<main className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
					{renderTabContent()}
				</main>
			</div>
		</div>
	);
}

export default App;
