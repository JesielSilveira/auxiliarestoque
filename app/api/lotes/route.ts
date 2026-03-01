import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔥 Resolve o erro de build "Failed to collect page data"
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { produtoId, numero, quantidade, validade } = body;

    // 1. Validação básica
    if (!produtoId || !numero || !quantidade || !validade) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // 2. Busca o produto para pegar o volumeUnidade atual
    const produto = await prisma.produto.findUnique({
      where: { id: Number(produtoId) }
    });

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // 3. Conversão correta da data
    const dataValidade = new Date(`${validade}T12:00:00`); // Usar 12h evita problemas de fuso horário

    if (isNaN(dataValidade.getTime())) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 });
    }

    // 4. Criação do Lote
    const lote = await prisma.lote.create({
      data: {
        numero,
        validade: dataValidade,
        quantidadeLote: Number(quantidade),
        produtoId: Number(produtoId),
        // Se você adicionou o volumeUnidade ao Lote no schema, inclua aqui:
        // volumeUnidade: produto.volumeUnidade 
      },
    });

    return NextResponse.json(lote);

  } catch (error) {
    console.error("Erro ao criar lote:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}