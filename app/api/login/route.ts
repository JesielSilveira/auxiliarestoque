import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { senha } = await req.json();

  // senha do .env
  if (senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Senha inválida" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  // ✅ COOKIE CORRETO
  response.cookies.set("auth", "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  });

  return response;
}