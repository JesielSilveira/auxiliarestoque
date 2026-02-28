export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ContagemEstoque from "./ContagemEstoque";

export default async function Page() {

  const produtos = await prisma.produto.findMany({
    where: {
      estoqueBruto: {
        gt: 0,
      },
    },
    orderBy: { nome: "asc" },
  });

  const serializados = produtos.map(p => ({
    id: p.id,
    nome: p.nome,
    saldo: Number(p.estoqueBruto),
    volume: Number(p.volumeUnidade),
    unidade: p.unidadeMedida,
  }));

  return <ContagemEstoque produtos={serializados} />;
}