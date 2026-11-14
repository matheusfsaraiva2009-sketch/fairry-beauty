import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin(); if (err) return err;
  const [products, massages, orders, appointments, pendingOrders, pendingAppointments, recentOrders, recentAppointments] = await Promise.all([
    prisma.product.count(),
    prisma.massage.count(),
    prisma.order.count(),
    prisma.appointment.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.appointment.count({ where: { status: "pending" } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { select: { name: true } } } }, user: { select: { name: true } } },
    }),
    prisma.appointment.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { massage: { select: { name: true } }, user: { select: { name: true } } },
    }),
  ]);
  return NextResponse.json({ products, massages, orders, appointments, pendingOrders, pendingAppointments, recentOrders, recentAppointments });
}
