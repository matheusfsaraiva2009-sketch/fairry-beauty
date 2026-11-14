import { NextResponse } from "next/server";

// Registro de novos usuários está desabilitado.
// Acesso ao sistema é restrito ao administrador.
export async function POST() {
  return NextResponse.json(
    { error: "Registro de novos usuários não está disponível." },
    { status: 403 }
  );
}
