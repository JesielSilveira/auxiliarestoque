// app/estoque-detalhado/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import DetalheEstoqueClient from "./DetalheEstoqueClient";

export default async function Page() {
  // 1. Buscamos os produtos INCLUINDO os lotes relacionados
  const produtosDoBanco = await prisma.produto.findMany({
    include: {
      lotes: true, // Isso traz a tabela de validades
    },
    orderBy: { nome: 'asc' },
  });

  // 2. Criamos uma lista "achatada" (uma linha para cada lote)
  const dadosFormatados: any[] = [];

  produtosDoBanco.forEach((p) => {
    // Se o produto tiver lotes cadastrados, mostramos cada um
    if (p.lotes.length > 0) {
      p.lotes.forEach((lote) => {
        dadosFormatados.push({
          id: `${p.id}-${lote.id}`,
          nome: p.nome,
          volume: Number(p.volumeUnidade),
          unidade: p.unidadeMedida,
          // Converte o DateTime do banco para o formato de leitura
          validade: lote.validade.toLocaleDateString('pt-BR'), 
          saldo: Number(lote.quantidadeLote), // Saldo do lote específico
          numeroLote: lote.numero
        });
      });
    } else {
      // Se não tiver lote, mostra o saldo geral (opcional)
      dadosFormatados.push({
        id: p.id.toString(),
        nome: p.nome,
        volume: Number(p.volumeUnidade),
        unidade: p.unidadeMedida,
        validade: "NÃO INFORMADO",
        saldo: Number(p.estoqueBruto),
        numeroLote: "S/L"
      });
    }
  });

  return <DetalheEstoqueClient estoque={dadosFormatados} />;
}