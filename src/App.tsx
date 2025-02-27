import { useState } from "react";
import Calculator from "./components/Calculator";
import TextToShader from "./components/TextToShader";

function App() {
  const [activeTab, setActiveTab] = useState("calculator");

  const calculatorComponent = <Calculator />;
  const shaderComponent = <TextToShader />;
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-gray-100">Zenait</h1>
          
          <div className="flex gap-1">
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
        
        <div className=" h-() overflow-y-auto">
          <div className="p-6">
            <div style={{ display: activeTab === "calculator" ? "block" : "none" }}>
              {calculatorComponent}
            </div>
            <div style={{ display: activeTab === "shader" ? "block" : "none" }}>
              {shaderComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all w-28 ${
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