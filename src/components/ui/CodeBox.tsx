import React from "react";

interface ShaderCodeDisplayProps {
  code: string;
}

const ShaderCodeDisplay: React.FC<ShaderCodeDisplayProps> = ({ code }) => (
  <div className="mt-4">
    <h3 className="text-lg font-medium text-gray-200 mb-2">Shader Code</h3>
    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-gray-700 text-gray-300">
      <code>{code}</code>
    </pre>
  </div>
);

export default ShaderCodeDisplay;
