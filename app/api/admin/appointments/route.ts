import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin(); if (err) return err;
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: {
      massage: { select: { name: true, price: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  return NextResponse.json(appointments);
}
