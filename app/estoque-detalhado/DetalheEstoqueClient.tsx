"use client";
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Calendar, Box, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DetalheEstoqueClient({ estoque = [] }: { estoque: any[] }) {
  const [busca, setBusca] = useState("");

  const listaFiltrada = estoque.filter(item => 
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      {/* HEADER TÉCNICO */}
      <header className="bg-slate-900 text-white p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight">Controle de Inventário</h1>
        </div>
        
        {/* BUSCA INTEGRADA AO HEADER */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nome do químico..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-800 border-none rounded-xl text-sm font-bold placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>

      <div className="p-4">
        {/* TABELA DE DADOS */}
        <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto / Vol</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Validade</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Saldo Real</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 active:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-black text-slate-800 uppercase text-sm leading-tight">{item.nome}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                      Emb: {item.volume}{item.unidade}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                      <Calendar size={12} className="text-blue-600" />
                      <span className="text-xs font-black text-blue-700 uppercase">
                        {item.validade}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-slate-900 tracking-tighter">
                        {item.saldo}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase">
                        {item.unidade} Total
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMO NO RODAPÉ */}
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-dashed border-slate-200">
           <div className="flex items-center gap-3">
              <Box className="text-slate-400" size={20} />
              <p className="text-xs font-bold text-slate-500 uppercase">Itens Listados</p>
           </div>
           <span className="font-black text-slate-900">{listaFiltrada.length}</span>
        </div>
      </div>
    </main>
  );
}