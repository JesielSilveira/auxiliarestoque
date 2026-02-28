import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, tipoDocumento } = body;

  if (!id || !tipoDocumento) return new Response("Dados inválidos", { status: 400 });

  const idInt = parseInt(id); // <-- CONVERTE PARA NÚMERO
  if (isNaN(idInt)) return new Response("ID inválido", { status: 400 });

  await prisma.movimentacao.update({
    where: { id: idInt },
    data: {
      tipoDocumento,
      comNota: tipoDocumento === "COM NOTA",
    },
  });

  return new Response("OK");
}