"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  AlertTriangle,
  CheckCircle,
  Search,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function ControleValidadeClient({
  produtosIniciais = [],
}: {
  produtosIniciais: any[];
}) {
  const [busca, setBusca] = useState("");

  // ✅ formata data vinda do prisma
  const formatarData = (data: string | Date) => {
    if (!data) return "--/--/----";

    const d = new Date(data);

    return d.toLocaleDateString("pt-BR");
  };

  // ✅ calcula status validade
  const processarItem = (item: any) => {
    try {
      const hoje = new Date();
      const dataVenc = new Date(item.validade);

      const diffTime = dataVenc.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status = "ok";

      if (diffDays <= 30) status = "urgente";
      else if (diffDays <= 120) status = "atencao";

      return {
        ...item,
        nome: item.produto?.nome ?? "Produto",
        unidade: item.produto?.unidadeMedida ?? "",
        estoque: Number(item.quantidadeLote ?? 0),
        vencimento: formatarData(item.validade),
        status,
        dias: diffDays,
      };
    } catch {
      return {
        ...item,
        nome: "Produto",
        unidade: "",
        estoque: 0,
        vencimento: "--/--/----",
        status: "ok",
        dias: 999,
      };
    }
  };

  const listaProcessada = produtosIniciais
    .map(processarItem)
    .filter((p) =>
      (p.nome ?? "").toLowerCase().includes(busca.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-[#F1F5F9] pb-24 font-sans text-slate-900">
      <header className="bg-[#1D4ED8] text-white p-5 sticky top-0 z-40 shadow-lg flex items-center gap-4">
        <Link
          href="/"
          className="active:scale-90 transition-transform p-2 bg-white/10 rounded-xl"
        >
          <ArrowLeft size={24} />
        </Link>

        <h1 className="text-xl font-black uppercase tracking-tighter">
          Alertas de Validade
        </h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="space-y-3">
          {listaProcessada.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none mb-1 uppercase italic">
                    {item.nome}
                  </h2>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    SALDO: {item.estoque} {item.unidade}
                  </p>
                </div>

                <div
                  className={`p-2 rounded-xl ${
                    item.status === "urgente"
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : item.status === "atencao"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.status === "urgente" ? (
                    <AlertTriangle size={24} />
                  ) : item.status === "atencao" ? (
                    <Clock size={24} />
                  ) : (
                    <CheckCircle size={24} />
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Vencimento
                  </p>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-blue-600" />
                    <span className="text-lg font-black text-slate-800">
                      {item.vencimento}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-4 py-2 rounded-2xl font-black text-[11px] uppercase shadow-sm ${
                    item.status === "urgente"
                      ? "bg-red-600 text-white"
                      : item.status === "atencao"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.status === "ok"
                    ? "Seguro"
                    : `${item.dias} Dias`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/validade/novo"
        className="fixed bottom-6 right-6 bg-blue-700 text-white p-5 rounded-[2rem] shadow-2xl active:scale-90 transition-all border-4 border-white flex items-center justify-center"
      >
        <Plus size={32} strokeWidth={3} />
      </Link>
    </main>
  );
}