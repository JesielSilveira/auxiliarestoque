"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, FlaskConical, Box, Droplets, ArrowUpDown, Calculator } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ConversorPage() {
  const [volEmbalagem, setVolEmbalagem] = useState<string>("5");
  const [itensCaixa, setItensCaixa] = useState<string>("4");
  const [valorInput, setValorInput] = useState<string>("");
  const [modoInvertido, setModoInvertido] = useState(false); // false: Litros -> Caixas | true: Caixas -> Litros
  
  const [resultadoPrincipal, setResultadoPrincipal] = useState<number>(0);
  const [resultadoSecundario, setResultadoSecundario] = useState<number>(0);

  useEffect(() => {
    const valor = parseFloat(valorInput) || 0;
    const vol = parseFloat(volEmbalagem) || 1;
    const itens = parseFloat(itensCaixa) || 1;

    if (!modoInvertido) {
      // LITROS PARA CAIXAS
      const unidades = valor / vol;
      const caixas = unidades / itens;
      setResultadoPrincipal(caixas);
      setResultadoSecundario(unidades);
    } else {
      // CAIXAS PARA LITROS
      const unidades = valor * itens;
      const litros = unidades * vol;
      setResultadoPrincipal(litros);
      setResultadoSecundario(unidades);
    }
  }, [valorInput, volEmbalagem, itensCaixa, modoInvertido]);

  const inverterModo = () => {
    setModoInvertido(!modoInvertido);
    setValorInput("");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-12 font-sans antialiased text-slate-900">
      {/* HEADER AZUL HOME */}
      <div className="flex items-center gap-4 mb-8">
        <a href="/" className="p-2 bg-white rounded-xl shadow-sm text-blue-600 hover:scale-110 transition-all">
          <ArrowLeft size={24} />
        </a>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">Calculadora SAP</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Conversão Inteligente</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* CONFIGURAÇÃO DO PRODUTO */}
        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Embalagem (L/Kg)</label>
            <div className="relative">
              <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" size={16} />
              <Input type="number" value={volEmbalagem} onChange={(e) => setVolEmbalagem(e.target.value)} className="pl-9 h-12 bg-slate-50 border-none rounded-xl font-bold" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Itens p/ Caixa</label>
            <div className="relative">
              <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" size={16} />
              <Input type="number" value={itensCaixa} onChange={(e) => setItensCaixa(e.target.value)} className="pl-9 h-12 bg-slate-50 border-none rounded-xl font-bold" />
            </div>
          </div>
        </div>

        {/* INPUT DE ENTRADA DINÂMICO */}
        <div className="space-y-3 relative">
          <div className="flex justify-between items-end px-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {modoInvertido ? "Quantas Caixas?" : "Quantos Litros/Kg?"}
            </label>
            <Button 
                onClick={inverterModo} 
                className="h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 text-[9px] font-black uppercase rounded-full px-4 gap-2 border-none transition-all active:scale-95"
            >
                <ArrowUpDown size={12} /> Alternar Modo
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 opacity-30">
                {modoInvertido ? <Box size={32} /> : <Droplets size={32} />}
            </div>
            <Input 
              type="number" 
              placeholder="0"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              className="w-full pl-16 h-24 bg-white border-2 border-transparent shadow-xl rounded-[2.5rem] text-4xl font-black text-slate-800 focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:border-blue-200 transition-all" 
            />
          </div>
        </div>

        {/* RESULTADO PRINCIPAL (AZUL DA HOME) */}
        <Card className="p-8 border-none shadow-2xl bg-blue-600 text-white rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase opacity-70 tracking-[0.2em]">
                    {modoInvertido ? "Volume Total Resultante" : "Total de Caixas Fechadas"}
                </p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-6xl font-black tracking-tighter mt-2">
                        {resultadoPrincipal % 1 === 0 ? resultadoPrincipal : resultadoPrincipal.toFixed(2)}
                    </h2>
                    <span className="text-xl font-bold opacity-60 uppercase italic">
                        {modoInvertido ? "Litros" : "Cxs"}
                    </span>
                </div>
            </div>
            <Calculator size={120} className="absolute -right-8 -bottom-8 text-white opacity-10 rotate-12" />
        </Card>

        {/* RESULTADO SECUNDÁRIO (CÉLULAS/UNIDADES) */}
        <Card className="p-6 border-none shadow-md bg-white text-slate-800 rounded-[2.5rem] flex items-center justify-between border border-blue-50">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equivale a (Células/Unidades)</p>
                <h2 className="text-3xl font-black tracking-tighter mt-1 text-blue-600">
                    {resultadoSecundario % 1 === 0 ? resultadoSecundario : resultadoSecundario.toFixed(1)}
                </h2>
            </div>
            <FlaskConical size={32} className="text-blue-100" />
        </Card>

        <Button 
          onClick={() => {setValorInput(""); setResultadoPrincipal(0); setResultadoSecundario(0);}}
          variant="ghost" 
          className="w-full h-12 text-slate-400 font-bold hover:bg-slate-200 rounded-2xl uppercase text-[9px] tracking-[0.2em]"
        >
          <RefreshCw size={14} className="mr-2" /> Limpar Tudo
        </Button>
      </div>

      <p className="text-center text-[9px] text-slate-300 font-black uppercase mt-10 tracking-[0.3em]">
        LOGÍSTICA JESIEL MARQUES DA SILVEIRA
      </p>
    </main>
  );
}