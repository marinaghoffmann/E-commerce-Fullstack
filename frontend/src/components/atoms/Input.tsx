import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erro?: string;
}

export function Input({ label, erro, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm text-gray-900
          placeholder-gray-400 transition-colors focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          ${erro ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}
          ${className}
        `}
        {...props}
      />
      {erro && <p className="text-xs text-red-500">{erro}</p>}
    </div>
  );
}
