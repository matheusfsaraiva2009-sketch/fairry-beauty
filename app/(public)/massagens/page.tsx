import { prisma } from "@/lib/prisma";
import MassagesClient from "@/components/massages/MassagesClient";

export const dynamic = "force-dynamic";

export default async function MassagensPage() {
  const massages = await prisma.massage.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <MassagesClient massages={massages} />;
}
