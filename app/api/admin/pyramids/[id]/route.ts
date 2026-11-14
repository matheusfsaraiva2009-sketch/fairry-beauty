import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const data = await req.json();
  const p = await prisma.olfactivePyramid.update({
    where: { id },
    data: {
      name: data.name, description: data.description || null, image: data.image || null,
      topNotes: data.topNotes || null, heartNotes: data.heartNotes || null,
      baseNotes: data.baseNotes || null, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(p);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  await prisma.olfactivePyramid.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
