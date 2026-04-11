import React from "react";

export function ErrorMessage({ mensagem }: { mensagem: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <span className="text-xl">⚠️</span>
      <p className="text-sm">{mensagem}</p>
    </div>
  );
}
