import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/session";

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  const session = await getSession();
  const orders = await prisma.order.findMany({
    where: { userId: (session?.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true, image: true } } } } },
  });
  return NextResponse.json(orders);
}
