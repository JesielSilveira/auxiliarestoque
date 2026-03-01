import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. FORÇA A ROTA A SER DINÂMICA (Isso resolve o erro de build)
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const produtoId = searchParams.get("produtoId");

    // Se não houver ID, retornamos um 400 ou objeto vazio de forma segura
    if (!produtoId) {
      return NextResponse.json({ error: "produtoId é obrigatório" }, { status: 400 });
    }

    const idNum = Number(produtoId);

    // 2. BUSCA EXECUTADA APENAS EM RUNTIME
    const produto = await prisma.produto.findUnique({
      where: { id: idNum },
      include: {
        movimentacoes: {
          where: {
            tipo: "SAIDA",
            comNota: false
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // 3. RETORNO DOS DADOS
    return NextResponse.json({
      saldoSistema: Number(produto.estoqueBruto),
      unidade: produto.unidadeMedida,
      saidasSemNota: produto.movimentacoes.map(s => ({
        id: s.id,
        qtd: Number(s.quantidade),
        data: s.createdAt,
        produtor: s.cliente || "Cliente" // Já usa o campo cliente que existe no seu schema
      }))
    });

  } catch (error) {
    console.error("Erro na API de contagem:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}