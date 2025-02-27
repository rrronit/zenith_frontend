import React from "react";

interface ShaderFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isFixing: boolean;
}

const ShaderForm: React.FC<ShaderFormProps> = ({ 
  prompt, 
  setPrompt, 
  onSubmit, 
  isLoading, 
  isFixing 
}) => (
  <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Describe your shader (e.g., colorful rotating 3D cube)"
      disabled={isLoading || isFixing}
      className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:bg-gray-800 disabled:text-gray-500 bg-gray-800 text-gray-200"
    />
    <button 
      type="submit" 
      disabled={isLoading || isFixing} 
      className={`px-4 py-2 rounded-lg font-medium text-white sm:whitespace-nowrap ${
        isLoading || isFixing 
          ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
          : "bg-purple-600 hover:bg-purple-700 transition-colors"
      }`}
    >
      {isLoading ? "Generating..." : "Generate Shader"}
    </button>
  </form>
);

export default ShaderForm;