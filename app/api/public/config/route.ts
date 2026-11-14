import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.siteConfig.findMany();
  const obj: Record<string, string> = {};
  for (const c of configs) obj[c.key] = c.value;
  return NextResponse.json(obj);
}
