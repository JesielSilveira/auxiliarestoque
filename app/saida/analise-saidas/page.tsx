export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Package,
  TrendingDown,
  FileText,
} from "lucide-react";
import Link from "next/link";

type SearchParams = {
  produto?: string;
  dataInicial?: string;
  dataFinal?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { produto, dataInicial, dataFinal } = searchParams;

  const where: any = { tipo: "SAIDA" };

  if (produto) {
    where.produto = {
      nome: { contains: produto, mode: "insensitive" },
    };
  }

  if (dataInicial || dataFinal) {
    where.createdAt = {};
    if (dataInicial) where.createdAt.gte = new Date(dataInicial);
    if (dataFinal) where.createdAt.lte = new Date(dataFinal + "T23:59:59");
  }

  const saidasDB = await prisma.movimentacao.findMany({
    where,
    include: {
      produto: { select: { nome: true, volumeUnidade: true, unidadeMedida: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const saidas = saidasDB.map((s) => ({
    id: s.id,
    data: s.createdAt,
    produto: s.produto.nome,
    quantidade: Number(s.quantidade),
    unidade: s.produto.unidadeMedida,
    volume: Number(s.produto.volumeUnidade),
    tipoDocumento: s.tipoDocumento ?? "SEM NOTA",
  }));

  const totalSaidas = saidas.reduce((acc, s) => acc + s.quantidade, 0);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 pb-12 font-sans">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <a
          href="/saida"
          className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition"
        >
          <ArrowLeft size={24} />
        </a>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Análise de Saídas
          </h1>
          <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
            Controle Logístico
          </p>
        </div>
      </div>

      {/* FILTROS */}
      <form className="bg-white rounded-2xl shadow-md p-4 sm:p-5 mb-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Filter size={18} /> Filtros
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          <input
            type="text"
            name="produto"
            placeholder="Produto..."
            defaultValue={produto ?? ""}
            className="h-12 w-full rounded-xl border border-slate-200 px-4 font-semibold"
          />
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="dataInicial"
              defaultValue={dataInicial ?? ""}
              className="pl-10 h-12 w-full rounded-xl border border-slate-200 font-semibold"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="dataFinal"
              defaultValue={dataFinal ?? ""}
              className="pl-10 h-12 w-full rounded-xl border border-slate-200 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="h-12 w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase shadow-md transition active:scale-95"
          >
            Filtrar
          </button>
        </div>
      </form>

      {/* RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
          <TrendingDown className="text-red-500" size={32} />
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total de Saídas</p>
            <p className="text-2xl font-black text-slate-800">{totalSaidas.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
          <Package className="text-slate-500" size={32} />
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Registros</p>
            <p className="text-2xl font-black text-slate-800">{saidas.length}</p>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-slate-100 text-slate-500 uppercase text-xs font-black">
            <tr>
              <th className="p-2 sm:p-4 text-left">Data</th>
              <th className="p-2 sm:p-4 text-left">Produto</th>
              <th className="p-2 sm:p-4 text-left">Embalagem</th>
              <th className="p-2 sm:p-4 text-left">Qtd</th>
              <th className="p-2 sm:p-4 text-left">Documento</th>
              <th className="p-2 sm:p-4 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            {saidas.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50 transition">
                <td className="p-2 sm:p-4 font-semibold">{new Date(s.data).toLocaleDateString("pt-BR")}</td>
                <td className="p-2 sm:p-4 font-bold text-slate-700">{s.produto}</td>
                <td className="p-2 sm:p-4 font-semibold">{s.volume}{s.unidade}</td>
                <td className="p-2 sm:p-4 text-red-600 font-black">-{s.quantidade}</td>
                <td className="p-2 sm:p-4">
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-xl text-xs font-black flex items-center gap-1 w-fit
                    ${s.tipoDocumento === "COM NOTA"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                    <FileText size={14} />
                    {s.tipoDocumento}
                  </span>
                </td>
                <td className="p-2 sm:p-4">
                  <Link
                    href={`/saida/analise-saidas/${s.id}`}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Alterar Documento
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {saidas.length === 0 && (
          <div className="p-4 sm:p-8 text-center text-slate-400 font-semibold">
            Nenhuma saída encontrada.
          </div>
        )}
      </div>
    </main>
  );
}