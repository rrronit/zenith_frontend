import React from "react";

interface ShaderPreset {
  name: string;
  prompt: string;
}

interface PresetSelectorProps {
  presets: ShaderPreset[];
  onPresetSelect: (prompt: string) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ presets, onPresetSelect }) => (
  <div className="mb-2">
    <h3 className="text-sm font-medium text-gray-400 mb-2">Try an example:</h3>
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onPresetSelect(preset.prompt)}
          className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full border border-gray-700 transition-colors"
        >
          {preset.name}
        </button>
      ))}
    </div>
  </div>
);

export default PresetSelector;