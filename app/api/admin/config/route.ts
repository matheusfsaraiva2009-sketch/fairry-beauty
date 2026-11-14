import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const err = await requireAdmin(); if (err) return err;
  const configs = await prisma.siteConfig.findMany();
  const obj: Record<string, string> = {};
  for (const c of configs) obj[c.key] = c.value;
  return NextResponse.json(obj);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin(); if (err) return err;
  const data: Record<string, string> = await req.json();
  const updates = Object.entries(data).map(([key, value]) =>
    prisma.siteConfig.upsert({ where: { key }, update: { value }, create: { key, value } })
  );
  await Promise.all(updates);
  return NextResponse.json({ ok: true });
}
