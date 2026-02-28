"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle, History, Search } from "lucide-react";
import Link from "next/link";

export default function ContagemEstoque({ produtos }: any) {

  const [produtoId, setProdutoId] = useState("");
  const [saldoSistema, setSaldoSistema] = useState(0);
  const [volumeLabel, setVolumeLabel] = useState("");

  const [qtdFisica, setQtdFisica] = useState("");
  const [saidasSemNota, setSaidasSemNota] = useState<any[]>([]);

  /* =========================
     SELECIONOU PRODUTO
  ========================= */

  useEffect(() => {

    const produto = produtos.find(
      (p: any) => p.id == produtoId
    );

    if (!produto) return;

    setSaldoSistema(produto.saldo);
    setVolumeLabel(`${produto.volume}${produto.unidade}`);

    buscarSaidas(produto.id);

  }, [produtoId]);

  async function buscarSaidas(id: number) {

    const res = await fetch(
      `/api/contagem/sem-nota?produtoId=${id}`
    );

    const data = await res.json();
    setSaidasSemNota(data);
  }

  const diferenca =
    (Number(qtdFisica) || 0) - saldoSistema;

  const totalSemNota = saidasSemNota.reduce(
    (acc, s) => acc + s.quantidade,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-10">

      {/* HEADER */}
      <header className="bg-blue-700 text-white p-4 flex gap-4 items-center">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h1 className="font-bold text-xl">
          Contagem de Estoque
        </h1>
      </header>

      <div className="p-4 space-y-4">

        {/* PRODUTO */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">

          <select
            onChange={(e) =>
              setProdutoId(e.target.value)
            }
            className="w-full p-3 bg-slate-50 rounded-xl font-bold"
          >
            <option value="">
              Selecione o produto...
            </option>

            {produtos.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {p.volume}{p.unidade}
              </option>
            ))}
          </select>
        </div>

        {/* SALDOS */}
        {produtoId && (
          <>
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-white p-4 rounded-2xl text-center">
                <p className="text-xs font-black text-slate-400">
                  Sistema
                </p>
                <p className="text-2xl font-black text-blue-700">
                  {saldoSistema} ({volumeLabel})
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl text-center border-2 border-blue-600">
                <input
                  type="number"
                  value={qtdFisica}
                  onChange={(e) =>
                    setQtdFisica(e.target.value)
                  }
                  placeholder="Contagem física"
                  className="text-2xl font-black w-full text-center bg-transparent outline-none"
                />
              </div>
            </div>

            {/* DIVERGÊNCIA */}
            {diferenca < 0 && (
              <div className="space-y-3">

                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3">
                  <AlertCircle />
                  <div>
                    <p className="font-black">
                      Faltando {Math.abs(diferenca)}
                    </p>
                    <p className="text-xs">
                      Possível saída sem nota
                    </p>
                  </div>
                </div>

                {/* SAÍDAS SEM NOTA */}
                <div className="bg-orange-50 p-4 rounded-2xl">

                  <p className="text-xs font-black mb-2 flex gap-2">
                    <History size={14} />
                    Saídas SEM NOTA detectadas
                  </p>

                  {saidasSemNota.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white p-2 rounded-lg text-xs flex justify-between"
                    >
                      <span>
                        {s.cliente} —{" "}
                        {new Date(
                          s.data
                        ).toLocaleDateString("pt-BR")}
                      </span>

                      <span className="font-bold text-orange-600">
                        {s.quantidade}
                      </span>
                    </div>
                  ))}

                  <p className="text-[10px] mt-3 italic text-orange-600">
                    Sistema identificou {totalSemNota} unidades
                    sem nota.
                  </p>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}