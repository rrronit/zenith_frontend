import { useState } from "react";
import Calculator from "./components/Calculator";
import TextToShader from "./components/TextToShader";

function App() {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-medium text-gray-100 text-center sm:text-left">
            Zenith
          </h1>

          {/* Tab Buttons */}
          <div className="flex w-full sm:w-auto justify-center gap-2">
            <TabButton 
              isActive={activeTab === "calculator"} 
              onClick={() => setActiveTab("calculator")}
            >
              Calculator
            </TabButton>
            <TabButton 
              isActive={activeTab === "shader"} 
              onClick={() => setActiveTab("shader")}
            >
              Shader
            </TabButton>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {activeTab === "calculator" && <Calculator />}
          {activeTab === "shader" && <TextToShader />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none ${
        isActive 
          ? "bg-gray-800 text-purple-400 border border-gray-700" 
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export default App;
