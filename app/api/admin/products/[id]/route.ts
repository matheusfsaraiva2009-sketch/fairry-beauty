import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name, description: data.description, price: parseFloat(data.price),
      image: data.image || null, characteristics: data.characteristics || null,
      fragrance: data.fragrance || null, available: data.available ?? true,
      featured: data.featured ?? false, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await requireAdmin(); if (err) return err;
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
