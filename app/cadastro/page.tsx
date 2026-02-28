"use client"

import { cadastrarProduto } from "@/app/api/actions/produtos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TelaCadastro() {
  return (
    <main className="p-6 max-w-lg mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">NOVO ITEM</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Configuração de Inteligência de Estoque
        </p>
      </div>

      <form action={cadastrarProduto as any} className="space-y-6">
        <div className="space-y-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          
          {/* NOME E SAP */}
          <div className="grid gap-2">
            <Label htmlFor="nome" className="font-black text-[10px] uppercase ml-1 text-slate-400">Nome do Produto</Label>
            <Input name="nome" id="nome" placeholder="Ex: VIOVAN" required className="h-14 rounded-2xl border-none bg-slate-50 font-bold" />
            <Input name="codigoSap" placeholder="CÓDIGO SAP (Opcional)" className="h-12 rounded-xl border-none bg-slate-50 font-mono text-xs px-4" />
          </div>

          {/* VOLUME E UNIDADE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="font-black text-[10px] uppercase ml-1 text-slate-400">Volume Unid.</Label>
              <Input name="volumeUnidade" type="number" step="0.001" placeholder="10" required className="h-14 rounded-2xl border-none bg-blue-50/50 font-black text-blue-700" />
            </div>
            <div className="grid gap-2">
              <Label className="font-black text-[10px] uppercase ml-1 text-slate-400">Medida</Label>
              <select name="unidadeMedida" className="h-14 rounded-2xl border-none bg-blue-50/50 font-black text-blue-700 px-4 outline-none appearance-none">
                <option value="L">Litros (L)</option>
                <option value="Kg">Quilos (Kg)</option>
                <option value="G">Gramas (G)</option>
              </select>
            </div>
          </div>

          {/* CAIXARIA */}
          <div className="grid gap-2">
            <Label className="font-black text-[10px] uppercase ml-1 text-slate-400">Unidades por Caixa</Label>
            <Input name="itensPorCaixa" type="number" placeholder="Ex: 2" required className="h-14 rounded-2xl border-none bg-slate-50 font-bold" />
          </div>

          {/* SALDO INICIAL */}
          <div className="grid gap-2">
            <Label className="font-black text-[10px] uppercase ml-1 text-slate-400">Estoque Inicial (Bruto)</Label>
            <Input name="estoqueBruto" type="number" step="0.001" placeholder="Ex: 200" className="h-14 rounded-2xl border-none bg-slate-50 font-bold text-emerald-600" />
          </div>
        </div>

        <Button type="submit" className="w-full h-16 bg-blue-700 hover:bg-blue-800 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
          Gravar no Sistema
        </Button>
      </form>
    </main>
  );
}