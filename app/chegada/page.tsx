// app/chegada/page.tsx
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ChegadaForm from "./ChegadaForm";

export default async function Page() {
  const produtos = await prisma.produto.findMany({
    select: { id: true, nome: true, volumeUnidade: true, unidadeMedida: true },
    orderBy: { nome: 'asc' },
  });

  const formatados = produtos.map((p) => ({
    id: p.id.toString(),
    nome: p.nome,
    volumeUnidade: Number(p.volumeUnidade),
    unidadeMedida: p.unidadeMedida
  }));

  return <ChegadaForm produtos={formatados} />;
}