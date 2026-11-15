import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [products, massages, configs] = await Promise.all([
      prisma.product.findMany({ where: { available: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }], take: 4 }),
      prisma.massage.findMany({ where: { available: true }, orderBy: [{ sortOrder: "asc" }] }),
      prisma.siteConfig.findMany(),
    ]);
    const config: Record<string, string> = {};
    for (const c of configs) config[c.key] = c.value;
    return { products, massages, config };
  } catch { return { products: [], massages: [], config: {} }; }
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient {...data} />;
}
