import React from "react";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  isCompilationError?: boolean;
  onFixAttempt?: () => void;
  isFixing?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Error:",
  message,
  isCompilationError = false,
  onFixAttempt,
  isFixing = false,
}) => (
  <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm my-3">
    <div className="font-medium mb-1">{title}</div>
    <div className="whitespace-pre-wrap font-mono">{message}</div>
    
    {isCompilationError && onFixAttempt && (
      <button
        onClick={onFixAttempt}
        disabled={isFixing}
        className={`mt-2 px-3 py-1 rounded text-xs font-medium ${
          isFixing
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-red-700 hover:bg-red-800 text-white transition-colors"
        }`}
      >
        {isFixing ? "Fixing..." : "Attempt Fix"}
      </button>
    )}
  </div>
);

export default ErrorDisplay;