import { prisma } from "@/lib/prisma";

// 🔥 ISSO RESOLVE O ERRO DE BUILD: "Failed to collect page data"
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, tipoDocumento } = body;

    if (!id || !tipoDocumento) {
      return new Response("Dados inválidos", { status: 400 });
    }

    const idInt = parseInt(id); 
    if (isNaN(idInt)) {
      return new Response("ID inválido", { status: 400 });
    }

    // Atualização no banco
    await prisma.movimentacao.update({
      where: { id: idInt },
      data: {
        tipoDocumento,
        comNota: tipoDocumento === "COM NOTA",
      },
    });

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Erro ao alterar documento:", error);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}