import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

async function getData() {
  try {
    const [products, massages, pyramids, configs] = await Promise.all([
      prisma.product.findMany({ where: { available: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }], take: 4 }),
      prisma.massage.findMany({ where: { available: true }, orderBy: [{ sortOrder: "asc" }] }),
      prisma.olfactivePyramid.findMany({ orderBy: [{ sortOrder: "asc" }] }),
      prisma.siteConfig.findMany(),
    ]);
    const config: Record<string, string> = {};
    for (const c of configs) config[c.key] = c.value;
    return { products, massages, pyramids, config };
  } catch { return { products: [], massages: [], pyramids: [], config: {} }; }
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient {...data} />;
}
