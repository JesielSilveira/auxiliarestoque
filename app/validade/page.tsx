import { prisma } from "@/lib/prisma";
import ControleValidadeClient from "./ControleValidadeClient";

export default async function Page() {

  const lotes = await prisma.lote.findMany({
    include:{
      produto:true
    },
    orderBy:{
      validade:"asc"
    }
  });

  // 🔥 SERIALIZAÇÃO
  const lotesSerializados = lotes.map(l => ({
    id: l.id,
    numero: l.numero,
    validade: l.validade.toISOString(),
    quantidadeLote: Number(l.quantidadeLote),
    produtoId: l.produtoId,
    createdAt: l.createdAt.toISOString(),

    produto:{
      id:l.produto.id,
      nome:l.produto.nome,
      unidadeMedida:l.produto.unidadeMedida
    }
  }));

  return (
    <ControleValidadeClient produtosIniciais={lotesSerializados}/>
  );
}