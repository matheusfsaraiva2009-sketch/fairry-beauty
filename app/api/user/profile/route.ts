import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/session";

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: { id: (session?.user as any).id },
    select: { id: true, name: true, email: true, phone: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const err = await requireAuth(); if (err) return err;
  const session = await getSession();
  const { name, phone } = await req.json();
  const user = await prisma.user.update({
    where: { id: (session?.user as any).id },
    data: { name: name?.trim() || undefined, phone: phone?.trim() || null },
    select: { id: true, name: true, email: true, phone: true },
  });
  return NextResponse.json(user);
}
