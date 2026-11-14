import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const data = await req.json();
    const { guestName, guestPhone, guestEmail, massageId, date, time, notes } = data;
    if (!massageId || !date || !time) return NextResponse.json({ error: "Massagem, data e horário são obrigatórios." }, { status: 400 });
    if (!session && (!guestName || !guestPhone)) {
      return NextResponse.json({ error: "Nome e telefone são obrigatórios." }, { status: 400 });
    }
    const massage = await prisma.massage.findUnique({ where: { id: massageId } });
    if (!massage || !massage.available) return NextResponse.json({ error: "Massagem não disponível." }, { status: 400 });
    const appointmentDate = new Date(date);
    const existing = await prisma.appointment.findFirst({
      where: { massageId, date: appointmentDate, time, status: { in: ["pending", "confirmed"] } },
    });
    if (existing) return NextResponse.json({ error: "Este horário já está reservado. Escolha outro." }, { status: 409 });
    const appointment = await prisma.appointment.create({
      data: {
        userId: (session?.user as any)?.id || null,
        guestName: session ? null : guestName, guestPhone: session ? null : guestPhone, guestEmail: session ? null : guestEmail,
        massageId, date: appointmentDate, time, notes: notes || null, status: "pending",
      },
      include: { massage: { select: { name: true, price: true } } },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro interno." }, { status: 500 });
  }
}
