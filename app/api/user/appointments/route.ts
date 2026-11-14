import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/session";

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  const session = await getSession();
  const appointments = await prisma.appointment.findMany({
    where: { userId: (session?.user as any).id },
    orderBy: { date: "desc" },
    include: { massage: { select: { name: true, image: true, price: true } } },
  });
  return NextResponse.json(appointments);
}
