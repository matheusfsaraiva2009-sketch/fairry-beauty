import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const m = await prisma.massage.findUnique({ where: { id } });
  if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(m);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const data = await req.json();
  const m = await prisma.massage.update({
    where: { id },
    data: {
      name: data.name, description: data.description || null, objective: data.objective || null,
      benefits: data.benefits || null, duration: data.duration ? parseInt(data.duration) : null,
      price: data.price ? parseFloat(data.price) : null, image: data.image || null,
      available: data.available ?? true, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(m);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  await prisma.massage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
