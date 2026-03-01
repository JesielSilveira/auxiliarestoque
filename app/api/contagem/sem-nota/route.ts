import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. FORÇA O NEXT.JS A NÃO TRATAR ESSA ROTA COMO ESTÁTICA
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paramId = searchParams.get("produtoId");

    // Validação de entrada para evitar erro de conversão
    if (!paramId || isNaN(Number(paramId))) {
      return NextResponse.json([]);
    }

    const produtoId = Number(paramId);

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

    const resultado = saidas.map((s) => ({
      id: s.id,
      cliente: s.cliente ?? "Não informado",
      quantidade: Number(s.quantidade),
      data: s.dataMovimentacao, 
    }));

    return NextResponse.json(resultado);
    
  } catch (error) {
    console.error("Erro na rota sem-nota:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}