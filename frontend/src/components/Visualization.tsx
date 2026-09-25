import React from 'react';

interface Props {
  plotPath: string;
  onClose: () => void;
}

export default function Visualization({ plotPath, onClose }: Props) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Visualization</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
          Close
        </button>
      </div>
      <div className="p-4 flex justify-center">
        <img src={plotPath} alt="Chart" className="max-w-full rounded-lg" />
      </div>
    </div>
  );
}
