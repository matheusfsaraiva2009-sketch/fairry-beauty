import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const a = await prisma.appointment.findUnique({
    where: { id },
    include: { massage: true, user: true },
  });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(a);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const { status } = await req.json();
  const a = await prisma.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json(a);
}
