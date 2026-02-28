import { prisma } from "@/lib/prisma";

export async function GET() {
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

  return Response.json(lotes);
}