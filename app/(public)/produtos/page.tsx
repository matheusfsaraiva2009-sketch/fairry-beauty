import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/products/ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <ProductsClient products={products} />;
}
