import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

interface SearchBarProps {
  valor: string;
  onBuscar: (valor: string) => void;
  placeholder?: string;
}

export function SearchBar({ valor, onBuscar, placeholder = "Buscar produto..." }: SearchBarProps) {
  const [texto, setTexto] = useState(valor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(texto);
  };

  const handleLimpar = () => {
    setTexto("");
    onBuscar("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder}
          className="pr-8"
        />
        {texto && (
          <button
            type="button"
            onClick={handleLimpar}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <Button type="submit">Buscar</Button>
    </form>
  );
}
