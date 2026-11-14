import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const err = await requireAuth(); if (err) return err;
  const session = await getSession();
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Dados inválidos. Nova senha mínimo 6 caracteres." }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { id: (session?.user as any).id } });
  if (!user?.password) return NextResponse.json({ error: "Sem senha definida." }, { status: 400 });
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  return NextResponse.json({ ok: true });
}
