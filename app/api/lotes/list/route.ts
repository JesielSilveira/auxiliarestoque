import { prisma } from "@/lib/prisma";

// 🔥 Adicione esta linha para corrigir o erro de build
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const lotes = await prisma.lote.findMany({
      orderBy: {
        validade: "asc",
      },
      include: {
        produto: {
          select: {
            nome: true,
            unidadeMedida: true,
            volumeUnidade: true,
          },
        },
      },
    });

    // O Response.json é o padrão moderno do Next.js/Fetch API
    return Response.json(lotes);
    
  } catch (error) {
    console.error("Erro ao buscar lotes:", error);
    return Response.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}