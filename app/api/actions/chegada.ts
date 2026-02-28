"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registrarEntrada(formData: FormData) {
  const produtoId = formData.get("produtoId") as string;
  const novoNome = formData.get("novoNome") as string; // Para produto novo
  const volumeUnidade = formData.get("volumeUnidade") as string;
  const unidadeMedida = formData.get("unidadeMedida") as string;
  const itensPorCaixa = formData.get("itensPorCaixa") as string;
  
  const quantidadeEntrada = parseFloat(formData.get("quantidade") as string);

  if (isNaN(quantidadeEntrada)) return;

  if (produtoId && produtoId !== "novo") {
    // CASO 1: PRODUTO JÁ EXISTE - APENAS SOMA ESTOQUE
    const produto = await prisma.produto.findUnique({ where: { id: parseInt(produtoId) } });
    if (!produto) throw new Error("Produto não encontrado");

    await prisma.produto.update({
      where: { id: parseInt(produtoId) },
      data: { estoqueBruto: Number(produto.estoqueBruto) + quantidadeEntrada },
    });
  } else if (novoNome) {
    // CASO 2: PRODUTO NOVO - CADASTRA E JÁ LANÇA O ESTOQUE
    await prisma.produto.create({
      data: {
        nome: novoNome.toUpperCase(),
        volumeUnidade: parseFloat(volumeUnidade),
        unidadeMedida: unidadeMedida as any,
        itensPorCaixa: parseInt(itensPorCaixa) || 1,
        estoqueBruto: quantidadeEntrada,
      },
    });
  }

  revalidatePath("/");
  redirect("/");
}