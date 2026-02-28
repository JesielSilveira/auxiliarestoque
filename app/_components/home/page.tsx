"use client";
import React, { useState, useMemo } from 'react';
import { 
  Menu, Search, FlaskConical, Plus, ArrowUpRight, 
  ArrowDownLeft, ClipboardCheck, RefreshCw, 
  CalendarDays, ChevronRight 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Produto {
  id: string | number;
  codigoSap?: string | null;
  nome: string;
  estoqueBruto: number;      
  volumeUnidade: number;   
  itensPorCaixa: number;     
  unidadeMedida: 'L' | 'Kg' | 'G';
}

export default function HomeClient({ produtosIniciais = [] }: { produtosIniciais?: Produto[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEstoque = useMemo(() => {
    return produtosIniciais.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.codigoSap?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, produtosIniciais]);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 font-sans antialiased">
      {/* --- HEADER --- */}
      <header className="bg-blue-700 text-white p-5 sticky top-0 z-40 shadow-lg flex justify-between items-center ">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Logística Agrícola</p>
          <h1 className="text-xl font-black italic">Jesiel Marques da Silveira</h1>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600 rounded-xl">
              <Menu size={28} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] rounded-l-[3rem] border-l-0 bg-white">
            <SheetHeader className="border-b pb-6 mb-6">
              <SheetTitle className="text-2xl font-black text-blue-700 uppercase tracking-tighter">Ações AE</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4">
               <MenuLink icon={<ArrowUpRight />} label="Saída" sub="Retirada" color="bg-red-50 text-red-600" href="/saida" />
               <MenuLink icon={<ArrowDownLeft />} label="Chegada" sub="Entrada" color="bg-emerald-50 text-emerald-600" href="/chegada" />
               <MenuLink icon={<ClipboardCheck />} label="Contagem" sub="Inventário" color="bg-blue-50 text-blue-600" href="/contagem" />
               <MenuLink icon={<RefreshCw />} label="Conversor" sub="Cálculos" color="bg-purple-50 text-purple-600" href="/conversor" />
               <MenuLink icon={<CalendarDays />} label="Validade" sub="Lotes" color="bg-orange-50 text-orange-600" href="/validade" />
               <MenuLink icon={<Plus />} label="Novo Item" sub="Cadastro" color="bg-slate-100 text-slate-700" href="/cadastro" />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* --- BUSCA --- */}
      <div className="px-6 mt-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <Input 
            placeholder="Buscar químico ou código..." 
            className="w-full pl-12 h-14 bg-white border-none shadow-xl rounded-2xl text-base focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- LISTAGEM --- */}
      <section className="p-6 space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Estoque Disponível</h3>
          <Badge variant="outline" className="bg-white">{filteredEstoque.length} itens</Badge>
        </div>

        {filteredEstoque.length === 0 && (
          <p className="text-center text-slate-400 py-10 font-bold uppercase tracking-tighter">Nenhum item em estoque</p>
        )}

        {filteredEstoque.map((item) => {
          const unidades = item.estoqueBruto / item.volumeUnidade;
          const caixas = unidades / item.itensPorCaixa;

          return (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] rounded-[2rem] bg-white">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <Badge variant="secondary" className="font-mono text-[10px]">{item.codigoSap || 'S/ COD'}</Badge>
                  <CardTitle className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">
                    {item.nome} {item.volumeUnidade}{item.unidadeMedida}
                  </CardTitle>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <FlaskConical size={20} />
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Células</p>
                    <p className="text-xl font-black text-slate-700">{unidades % 1 === 0 ? unidades : unidades.toFixed(1)}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Caixas</p>
                    <p className="text-xl font-black text-blue-700">{caixas % 1 === 0 ? caixas : caixas.toFixed(1)}</p>
                  </div>

                  <div className="bg-blue-600 p-3 rounded-2xl shadow-inner text-center">
                    <p className="text-[9px] font-black text-blue-200 uppercase leading-none mb-1 italic">Total {item.unidadeMedida}</p>
                    <p className="text-xl font-black text-white">{item.estoqueBruto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

function MenuLink({ icon, label, sub, color, href }: any) {
  return (
    <a href={href} className="group block">
      <div className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 active:scale-95 transition-all">
        <div className={`p-3 rounded-2xl ${color} shadow-sm group-hover:shadow-md transition-all`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-black text-slate-800 text-sm leading-none">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{sub}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </a>
  );
}