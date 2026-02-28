import { prisma } from "@/lib/prisma";

export async function GET() {
  const produtos = await prisma.produto.findMany({
    select: {
      id: true,
      nome: true,
    },
  });

  return Response.json(produtos);
}