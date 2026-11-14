import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const products = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const data = await req.json();
  const product = await prisma.product.create({
    data: {
      name: data.name, description: data.description, price: parseFloat(data.price),
      image: data.image || null, characteristics: data.characteristics || null,
      fragrance: data.fragrance || null, available: data.available ?? true,
      featured: data.featured ?? false, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
