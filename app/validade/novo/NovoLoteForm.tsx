"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default function NovoLoteForm({ produtos }: { produtos: any[] }) {

  const router = useRouter();
  const [loading,setLoading] = useState(false);

  const [form,setForm] = useState({
    produtoId:"",
    numero:"",
    quantidade:"",
    validade:""
  });

  async function salvar(e:any){
    e.preventDefault();
    setLoading(true);

    await fetch("/api/lotes",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify(form)
    });

    router.push("/validade");
    router.refresh();
  }

  return(
    <main className="min-h-screen bg-[#F1F5F9] pb-24 font-sans text-slate-900">

      {/* HEADER IGUAL */}
      <header className="bg-[#1D4ED8] text-white p-5 sticky top-0 z-40 shadow-lg flex items-center gap-4">
        <Link href="/validade" className="p-2 bg-white/10 rounded-xl active:scale-90">
          <ArrowLeft size={24}/>
        </Link>

        <h1 className="text-xl font-black uppercase tracking-tighter">
          Novo Lote
        </h1>
      </header>

      <form onSubmit={salvar} className="p-4 space-y-4">

        {/* PRODUTO */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 space-y-2">

          <label className="text-[11px] font-black uppercase text-slate-400">
            Produto
          </label>

          <select
            required
            value={form.produtoId}
            onChange={e=>setForm({...form,produtoId:e.target.value})}
            className="w-full h-14 px-4 rounded-xl border font-bold outline-none"
          >
            <option value="">Selecionar produto</option>

            {produtos.map(p=>(
              <option key={p.id} value={p.id}>
                {p.nome} — {p.volumeUnidade} {p.unidadeMedida}
              </option>
            ))}
          </select>

        </div>

        {/* LOTE */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 space-y-2">

          <label className="text-[11px] font-black uppercase text-slate-400">
            Número do lote
          </label>

          <input
            required
            placeholder="Ex: 001"
            className="w-full h-14 px-4 rounded-xl border font-bold outline-none"
            onChange={e=>setForm({...form,numero:e.target.value})}
          />

        </div>

        {/* QUANTIDADE */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 space-y-2">

          <label className="text-[11px] font-black uppercase text-slate-400">
            Quantidade do lote
          </label>

          <input
            type="number"
            step="0.001"
            required
            placeholder="Quantidade"
            className="w-full h-14 px-4 rounded-xl border font-bold outline-none"
            onChange={e=>setForm({...form,quantidade:e.target.value})}
          />

        </div>

        {/* VALIDADE */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-200 space-y-2">

          <label className="text-[11px] font-black uppercase text-slate-400">
            Data de validade
          </label>

          <input
            type="date"
            required
            className="w-full h-14 px-4 rounded-xl border font-bold outline-none"
            onChange={e=>setForm({...form,validade:e.target.value})}
          />

        </div>

        {/* BOTÃO */}
        <button
          disabled={loading}
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-5 rounded-[2rem] shadow-2xl active:scale-90 transition-all border-4 border-white flex items-center justify-center"
        >
          <Plus size={32} strokeWidth={3}/>
        </button>

      </form>

    </main>
  );
}