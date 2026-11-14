import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const body = await req.json();
  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role || null,
      image: body.image || null,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(member, { status: 201 });
}
