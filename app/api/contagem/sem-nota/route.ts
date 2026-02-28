import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const produtoId = Number(searchParams.get("produtoId"));

  if (!produtoId) {
    return NextResponse.json([]);
  }

  const saidas = await prisma.movimentacao.findMany({
    where: {
      produtoId,
      tipo: "SAIDA",
      comNota: false,
    },
    orderBy: {
      dataMovimentacao: "desc",
    },
    select: {
      id: true,
      cliente: true,
      quantidade: true,
      dataMovimentacao: true,
    },
  });

  // 🔥 AQUI É A PARTE IMPORTANTE
  const resultado = saidas.map((s) => ({
    id: s.id,
    cliente: s.cliente ?? "Não informado",
    quantidade: Number(s.quantidade),
    data: s.dataMovimentacao, // ← nome esperado pelo front
  }));

  return NextResponse.json(resultado);
}