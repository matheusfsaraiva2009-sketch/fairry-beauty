import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin(); if (err) return err;
  const pyramids = await prisma.olfactivePyramid.findMany({ orderBy: [{ sortOrder: "asc" }] });
  return NextResponse.json(pyramids);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(); if (err) return err;
  const data = await req.json();
  const p = await prisma.olfactivePyramid.create({
    data: {
      name: data.name, description: data.description || null, image: data.image || null,
      topNotes: data.topNotes || null, heartNotes: data.heartNotes || null,
      baseNotes: data.baseNotes || null, sortOrder: parseInt(data.sortOrder) || 0,
    },
  });
  return NextResponse.json(p, { status: 201 });
}
