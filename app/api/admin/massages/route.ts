import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin(); if (err) return err;
  const massages = await prisma.massage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(massages);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(); if (err) return err;
  const data = await req.json();
  const massage = await prisma.massage.create({
    data: {
      name: data.name, description: data.description || null, objective: data.objective || null,
      benefits: data.benefits || null, duration: data.duration ? parseInt(data.duration) : null,
      price: data.price ? parseFloat(data.price) : null, image: data.image || null,
      available: data.available ?? true, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(massage, { status: 201 });
}
