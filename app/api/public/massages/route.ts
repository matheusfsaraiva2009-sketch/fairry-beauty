import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const massages = await prisma.massage.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(massages);
}
