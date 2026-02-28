import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const { produtoId, numero, quantidade, validade } = body;

  // 🔥 validação REAL
  if (!produtoId || !numero || !quantidade || !validade) {
    return NextResponse.json(
      { error: "Dados incompletos" },
      { status: 400 }
    );
  }

  // 🔥 conversão correta da data
  const dataValidade = new Date(`${validade}T00:00:00`);

  if (isNaN(dataValidade.getTime())) {
    return NextResponse.json(
      { error: "Data inválida" },
      { status: 400 }
    );
  }

  const lote = await prisma.lote.create({
    data: {
      numero,
      validade: dataValidade,
      quantidadeLote: Number(quantidade),
      produtoId: Number(produtoId),
    },
  });

  return NextResponse.json(lote);
}