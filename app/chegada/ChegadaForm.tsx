"use client";
import React, { useState } from 'react';
import { ArrowLeft, PlusCircle, Save, Loader2, Truck, FlaskConical, PackageSearch, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registrarEntrada } from "@/app/api/actions/chegada";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg text-lg font-black uppercase gap-2 transition-all active:scale-95 disabled:opacity-70">
      {pending ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> Finalizar Entrada</>}
    </Button>
  );
}

export default function ChegadaForm({ produtos = [] }: { produtos: any[] }) {
  const [isNovo, setIsNovo] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-12 font-sans antialiased">
      <div className="flex items-center gap-4 mb-8">
        <a href="/" className="p-2 bg-white rounded-xl shadow-sm text-slate-400"><ArrowLeft size={24} /></a>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Entrada de Carga</h1>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Modo Cadastro Rápido Ativo</p>
        </div>
      </div>

      <form action={registrarEntrada} className="space-y-5">
        
        {/* SELETOR INTELIGENTE */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Produto no Sistema</label>
          <div className="relative">
            <select 
              name="produtoId" 
              required 
              onChange={(e) => setIsNovo(e.target.value === "novo")}
              className={`w-full h-14 bg-white border-2 ${isNovo ? 'border-emerald-500 shadow-emerald-100' : 'border-transparent shadow-md'} rounded-2xl px-4 font-bold text-slate-700 appearance-none transition-all`}
            >
              <option value="">Selecione o químico...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome.toUpperCase()} — {p.volumeUnidade}{p.unidadeMedida}</option>
              ))}
              <option value="novo" className="text-emerald-600 font-black">➕ NOVO PRODUTO (NÃO CADASTRADO)</option>
            </select>
            <PackageSearch className={`absolute right-4 top-1/2 -translate-y-1/2 ${isNovo ? 'text-emerald-500' : 'text-slate-300'}`} size={20} />
          </div>
        </div>

        {/* CAMPOS EXTRAS SE FOR PRODUTO NOVO */}
        {isNovo && (
          <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
             <p className="text-[10px] font-black text-emerald-600 uppercase text-center tracking-widest">Informações do Novo Produto</p>
             
             <Input name="novoNome" placeholder="NOME DO PRODUTO (EX: VIOVAN)" required className="h-14 bg-white border-none shadow-sm rounded-xl font-bold uppercase" />
             
             <div className="grid grid-cols-2 gap-3">
                <Input name="volumeUnidade" type="number" step="0.01" placeholder="VOL. EMB (5)" required className="h-14 bg-white border-none shadow-sm rounded-xl font-bold" />
                <select name="unidadeMedida" className="h-14 bg-white border-none shadow-sm rounded-xl font-bold px-3">
                    <option value="L">LITROS (L)</option>
                    <option value="Kg">QUILOS (KG)</option>
                    <option value="G">GALÕES (G)</option>
                </select>
             </div>
             <Input name="itensPorCaixa" type="number" placeholder="ITENS POR CAIXA (Ex: 4)" className="h-14 bg-white border-none shadow-sm rounded-xl font-bold" />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Fornecedor / Origem</label>
          <div className="relative">
            <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <Input name="fornecedor" placeholder="Ex: Syngenta / Cooperativa" className="w-full pl-12 h-14 bg-white border-none shadow-md rounded-2xl font-bold" />
          </div>
        </div>

        {/* QUANTIDADE TOTAL */}
        <div className="space-y-1 pt-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Quantidade Chegando (Total)</label>
          <div className="relative group">
            <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
            <Input name="quantidade" type="number" step="0.01" placeholder="0.00" required className="w-full pl-14 h-20 bg-white border-none shadow-xl rounded-3xl text-3xl font-black text-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500" />
          </div>
        </div>

        <SubmitButton />
      </form>
    </main>
  );
}