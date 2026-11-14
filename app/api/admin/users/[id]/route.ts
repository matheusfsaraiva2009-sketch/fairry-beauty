import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getSession } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const session = await getSession();
  const { role } = await req.json();
  if ((session?.user as any)?.id === id && role !== "admin") {
    return NextResponse.json({ error: "Não pode rebaixar a si mesmo." }, { status: 400 });
  }
  const user = await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ id: user.id, role: user.role });
}
