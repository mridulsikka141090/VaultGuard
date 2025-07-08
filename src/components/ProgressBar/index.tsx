// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="w-full p-5">
      {label && (
        <div className="mb-1 text-sm text-gray-700 flex justify-between">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
