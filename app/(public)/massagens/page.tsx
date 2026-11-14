import { prisma } from "@/lib/prisma";
import MassagesClient from "@/components/massages/MassagesClient";

export default async function MassagensPage() {
  const massages = await prisma.massage.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <MassagesClient massages={massages} />;
}
