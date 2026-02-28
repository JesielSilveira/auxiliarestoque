// app/saida/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SaidaForm from "./SaidaForm";

export default async function Page() {
  const produtosDoBanco = await prisma.produto.findMany({
    select: {
      id: true,
      nome: true,
      volumeUnidade: true,   // BUSCANDO O VOLUME
      unidadeMedida: true,    // BUSCANDO L ou Kg
    },
    orderBy: { nome: 'asc' },
  });

  const produtosFormatados = produtosDoBanco.map((p) => ({
    id: p.id.toString(),
    nome: p.nome,
    volumeUnidade: Number(p.volumeUnidade),
    unidadeMedida: p.unidadeMedida
  }));

  return <SaidaForm produtos={produtosFormatados} />;
}