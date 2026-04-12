import React, { useEffect, useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { getCategorias } from "../../services/api";
import type { ProdutoCreate, Produto } from "../../types";

interface ProductFormProps {
  inicial?: Produto;
  onSubmit: (dados: ProdutoCreate) => Promise<void>;
  onCancelar: () => void;
  titulo: string;
}

const campoVazio: ProdutoCreate = {
  nome_produto: "",
  categoria_produto: "",
  peso_produto_gramas: null,
  comprimento_centimetros: null,
  altura_centimetros: null,
  largura_centimetros: null,
};

export function ProductForm({ inicial, onSubmit, onCancelar, titulo }: ProductFormProps) {
  const [form, setForm] = useState<ProdutoCreate>(
    inicial ? { ...inicial } : { ...campoVazio }
  );
  const [categorias, setCategorias] = useState<string[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {});
  }, []);

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};
    if (!form.nome_produto.trim()) novosErros.nome_produto = "Nome é obrigatório";
    if (!form.categoria_produto.trim()) novosErros.categoria_produto = "Categoria é obrigatória";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (campo: keyof ProdutoCreate, valor: string) => {
    const numericFields = ["peso_produto_gramas", "comprimento_centimetros", "altura_centimetros", "largura_centimetros"];
    setForm((prev) => ({
      ...prev,
      [campo]: numericFields.includes(campo)
        ? valor === "" ? null : parseFloat(valor)
        : valor,
    }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-gray-900">{titulo}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nome do Produto"
          value={form.nome_produto}
          onChange={(e) => handleChange("nome_produto", e.target.value)}
          erro={erros.nome_produto}
          placeholder="Ex: Camiseta Básica"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Categoria</label>
          <input
            list="categorias-list"
            value={form.categoria_produto}
            onChange={(e) => handleChange("categoria_produto", e.target.value)}
            placeholder="Ex: vestuario"
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              erros.categoria_produto ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          <datalist id="categorias-list">
            {categorias.map((c) => <option key={c} value={c} />)}
          </datalist>
          {erros.categoria_produto && (
            <p className="text-xs text-red-500">{erros.categoria_produto}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Peso (gramas)"
            type="number"
            min="0"
            step="0.01"
            value={form.peso_produto_gramas ?? ""}
            onChange={(e) => handleChange("peso_produto_gramas", e.target.value)}
            placeholder="Ex: 500"
          />
          <Input
            label="Comprimento (cm)"
            type="number"
            min="0"
            step="0.01"
            value={form.comprimento_centimetros ?? ""}
            onChange={(e) => handleChange("comprimento_centimetros", e.target.value)}
            placeholder="Ex: 30"
          />
          <Input
            label="Altura (cm)"
            type="number"
            min="0"
            step="0.01"
            value={form.altura_centimetros ?? ""}
            onChange={(e) => handleChange("altura_centimetros", e.target.value)}
            placeholder="Ex: 20"
          />
          <Input
            label="Largura (cm)"
            type="number"
            min="0"
            step="0.01"
            value={form.largura_centimetros ?? ""}
            onChange={(e) => handleChange("largura_centimetros", e.target.value)}
            placeholder="Ex: 10"
          />
        </div>

        {sucesso && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            ✅ Salvo com sucesso!
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
