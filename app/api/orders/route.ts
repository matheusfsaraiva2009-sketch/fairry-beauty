import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const data = await req.json();
    const { guestName, guestPhone, guestEmail, notes, items } = data;
    if (!items || items.length === 0) return NextResponse.json({ error: "Nenhum item no pedido." }, { status: 400 });
    if (!session && (!guestName || !guestPhone)) {
      return NextResponse.json({ error: "Nome e telefone são obrigatórios." }, { status: 400 });
    }
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));
    let total = 0;
    const orderItems = items.map((i: any) => {
      const product = productMap.get(i.productId);
      if (!product) throw new Error(`Produto ${i.productId} não encontrado.`);
      const price = product.price * i.quantity;
      total += price;
      return { productId: i.productId, quantity: i.quantity, price: product.price };
    });
    const order = await prisma.order.create({
      data: {
        userId: (session?.user as any)?.id || null,
        guestName: session ? null : guestName, guestPhone: session ? null : guestPhone, guestEmail: session ? null : guestEmail,
        notes: notes || null, total, status: "pending",
        items: { create: orderItems },
      },
      include: { items: { include: { product: { select: { name: true } } } } },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro interno." }, { status: 500 });
  }
}
