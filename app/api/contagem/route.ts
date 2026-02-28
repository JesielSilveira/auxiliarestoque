import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produtoId");

  if (!produtoId)
    return NextResponse.json({});

  const produto = await prisma.produto.findUnique({
    where: { id: Number(produtoId) }
  });

  if (!produto)
    return NextResponse.json({});

  const saidasSemNota = await prisma.movimentacao.findMany({
    where: {
      produtoId: Number(produtoId),
      tipo: "SAIDA",
      comNota: false
    },
    orderBy: {
      createdAt: "desc"
    },
  });

  return NextResponse.json({
    saldoSistema: Number(produto.estoqueBruto),
    unidade: produto.unidadeMedida,
    saidasSemNota: saidasSemNota.map(s => ({
      id: s.id,
      qtd: Number(s.quantidade),
      data: s.createdAt,
      produtor: "Cliente" // se tiver campo cliente depois troca
    }))
  });
}