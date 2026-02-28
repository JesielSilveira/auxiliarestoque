"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registrarSaida(formData: FormData) {

  const produtoId = Number(formData.get("produtoId"));
  const quantidade = Number(formData.get("quantidade"));
  const cliente = String(formData.get("cliente"));
  const tipoDocumento = String(formData.get("tipoDocumento"));
  const dataRetirada = String(formData.get("dataRetirada"));
  const validadeInformada = String(formData.get("validade")); // MÊS/ANO do input

  if (!produtoId || !quantidade) throw new Error("Dados inválidos");

  //------------------------------------
  // BUSCA PRODUTO
  //------------------------------------
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId }
  });
  if (!produto) throw new Error("Produto não encontrado");

  const estoqueAtual = Number(produto.estoqueBruto);

  //------------------------------------
  // VALIDA ESTOQUE
  //------------------------------------
  if (estoqueAtual < quantidade) {
    throw new Error("Estoque insuficiente");
  }

  //------------------------------------
  // AVISO: UNIDADES MAIS VELHAS
  //------------------------------------
const lotes = await prisma.lote.findMany({
  where: {
    produtoId: produto.id,
    volumeUnidade: { equals: produto.volumeUnidade } 
  },
  orderBy: { validade: "asc" }
});

  if (lotes.length > 0) {
    const primeiraValidade = lotes[0].validade;
    const mesAnoLote = `${String(primeiraValidade.getMonth() + 1).padStart(2,"0")}/${primeiraValidade.getFullYear()}`;

    if (mesAnoLote < validadeInformada) {
      throw new Error(
        `⚠️ Atenção: existem unidades mais antigas que podem vencer primeiro (Validade lote: ${mesAnoLote})`
      );
    }
  }

  //------------------------------------
  // DEFINE SE TEM NOTA
  //------------------------------------
  const comNota = tipoDocumento === "COM NOTA";

  //------------------------------------
  // TRANSAÇÃO SEGURA
  //------------------------------------
  await prisma.$transaction([

    prisma.produto.update({
      where: { id: produtoId },
      data: { estoqueBruto: estoqueAtual - quantidade }
    }),

    prisma.movimentacao.create({
      data: {
        tipo: "SAIDA",
        quantidade,
        produtoId,
        cliente,
        tipoDocumento,
        comNota,
        dataMovimentacao: new Date(dataRetirada + "T12:00:00")
      }
    })

  ]);

  //------------------------------------
  // REFRESH UI
  //------------------------------------
  revalidatePath("/");
  revalidatePath("/analise-saidas");

  redirect("/");
}