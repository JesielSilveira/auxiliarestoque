import { prisma } from "@/lib/prisma";

// 🔥 RESOLVE O ERRO DE BUILD: Força a rota a buscar no banco apenas em tempo de execução
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: "asc", // Dica: sempre bom retornar em ordem alfabética para o front
      }
    });

    return Response.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos no build/runtime:", error);
    return Response.json({ error: "Erro ao carregar produtos" }, { status: 500 });
  }
}