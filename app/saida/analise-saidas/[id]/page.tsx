'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AlterarDocumento() {
  const params = useParams(); // pega params dinamicamente
  const router = useRouter();
  const id = params.id as string;

  const [tipoDocumento, setTipoDocumento] = useState("COM NOTA");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/movimentacao/alterar-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tipoDocumento }),
      });

      if (!res.ok) throw new Error("Erro ao alterar documento");

      alert("Documento alterado!");
      router.push("/saida/analise-saidas"); // volta para a lista
    } catch (err) {
      alert("Falha ao alterar documento: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-4"
    >
      <label className="block font-bold text-slate-700">Tipo de Documento</label>
      <select
        value={tipoDocumento}
        onChange={(e) => setTipoDocumento(e.target.value)}
        className="w-full p-3 border rounded-xl border-slate-200"
      >
        <option value="COM NOTA">COM NOTA</option>
        <option value="SEM NOTA">SEM NOTA</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Alterando..." : "Confirmar Alteração"}
      </button>
    </form>
  );
}