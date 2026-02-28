"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function cadastrarProduto(formData: FormData) {
  // Coleta os dados do formulário
  const nome = formData.get("nome") as string;
  const codigoSap = formData.get("codigoSap") as string;
  const volumeUnidade = parseFloat(formData.get("volumeUnidade") as string);
  const unidadeMedida = formData.get("unidadeMedida") as string;
  const itensPorCaixa = parseInt(formData.get("itensPorCaixa") as string);
  const estoqueBruto = parseFloat(formData.get("estoqueBruto") as string) || 0;

  try {
    // Inserção atômica no MySQL
    await prisma.produto.create({
      data: {
        nome: nome.toUpperCase(), // Padroniza para gritar no estoque
        codigoSap: codigoSap || null,
        volumeUnidade,
        unidadeMedida,
        itensPorCaixa,
        estoqueBruto,
      },
    });
  } catch (error) {
    console.error("Erro ao salvar no MySQL:", error);
    return { error: "Falha técnica ao registrar produto." };
  }

  // O "pulo do gato": limpa o cache da Home para o novo produto aparecer no print
  revalidatePath("/");
  redirect("/");
}