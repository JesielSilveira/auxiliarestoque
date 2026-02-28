"use client";
import React, { useState } from 'react';
import { ArrowLeft, MinusCircle, Save, Loader2, User, Calendar, FileText, FlaskConical, CalendarClock, BarChart3} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registrarSaida } from "@/app/api/actions/saida";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg text-lg font-black uppercase gap-2 transition-all active:scale-95 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> Confirmar Saída</>}
    </Button>
  );
}

export default function SaidaForm({ produtos = [] }: { produtos: any[] }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-12 font-sans antialiased">
<div className="flex items-center justify-between mb-8">

  <div className="flex items-center gap-4">
    <a
      href="/"
      className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-colors"
    >
      <ArrowLeft size={24} />
    </a>

    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">
        Saída de Material
      </h1>
      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
        Logística Jesiel Marques da Silveira
      </p>
    </div>
  </div>

  {/* BOTÃO ANALISE */}
  <a
    href="/saida/analise-saidas"
    className="flex items-center gap-2 h-12 px-4 bg-white border-none shadow-md rounded-2xl font-bold text-slate-600 hover:text-red-600 transition-all active:scale-95"
  >
    <BarChart3 size={20}/>
    Análise
  </a>

</div>

      <form action={registrarSaida} className="space-y-5">
        
        {/* CLIENTE */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Cliente / Destino</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <Input name="cliente" placeholder="Nome do produtor" required className="w-full pl-12 h-14 bg-white border-none shadow-md rounded-2xl font-bold" />
          </div>
        </div>

        {/* PRODUTO COM VOLUME EXIBIDO */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Produto (Item + Embalagem)</label>
          <div className="relative">
            <select name="produtoId" required className="w-full h-14 bg-white border-none shadow-md rounded-2xl px-4 font-bold text-slate-700 appearance-none">
              <option value="">Selecione o químico...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome.toUpperCase()} — {p.volumeUnidade}{p.unidadeMedida}
                </option>
              ))}
            </select>
            <FlaskConical className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          </div>
        </div>

        {/* VALIDADE (MÊS/ANO) */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Validade do Produto (Mês/Ano)</label>
          <div className="relative">
            <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <Input 
              name="validade" 
              placeholder="Ex: SET/2028" 
              required 
              className="w-full pl-12 h-14 bg-white border-none shadow-md rounded-2xl font-bold uppercase" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* DATA ATUAL */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Data Retirada</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <Input name="dataRetirada" type="date" required className="w-full pl-12 h-14 bg-white border-none shadow-md rounded-2xl font-bold text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          {/* NOTA OU SEM */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Documento</label>
            <div className="relative">
              <select name="tipoDocumento" required className="w-full h-14 bg-white border-none shadow-md rounded-2xl px-10 font-bold text-slate-700 appearance-none text-sm">
                <option value="COM NOTA">COM NOTA</option>
                <option value="SEM NOTA">SEM NOTA</option>
              </select>
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>
        </div>

        {/* QUANTIDADE TOTAL */}
        <div className="space-y-1 pt-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Quantidade Saindo (Total)</label>
          <div className="relative group">
            <MinusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={24} />
            <Input name="quantidade" type="number" step="0.01" placeholder="0.00" required className="w-full pl-14 h-20 bg-white border-none shadow-xl rounded-3xl text-3xl font-black text-slate-800 focus-visible:ring-2 focus-visible:ring-red-500" />
          </div>
        </div>

        <SubmitButton />
      </form>
    </main>
  );
}