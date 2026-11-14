import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

async function getSiteConfig() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const obj: Record<string, string> = {};
    for (const c of configs) obj[c.key] = c.value;
    return obj;
  } catch { return {}; }
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const config = await getSiteConfig();
  return (
    <>
      <Header config={config} />
      <main className="pt-16">{children}</main>
      <Footer config={config} />
    </>
  );
}
