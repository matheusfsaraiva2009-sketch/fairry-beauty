import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getData() {
  const configs = await prisma.siteConfig.findMany();
  const config: Record<string, string> = {};
  for (const c of configs) config[c.key] = c.value;
  return { config };
}

export default async function SobrePage() {
  const { config } = await getData();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white">
      {/* Hero */}
      <section className="py-20 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full text-sm text-[#3D2C4E] font-medium mb-6 border border-[#E6CBF7]/50">
            ✦ Nossa história
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#3D2C4E] mb-6">
            Quem Somos Nós?
          </h1>
          <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
            {config.aboutText || "Nossa história será preenchida pela administradora."}
          </p>
        </div>
      </section>

      {/* Objetivo */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Logo no lugar da flor */}
            <div className="bg-gradient-to-br from-[#E6CBF7]/30 to-[#FBB8D9]/30 rounded-3xl p-10 flex items-center justify-center min-h-64">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] opacity-20 blur-2xl scale-110" />
                <Image
                  src="/logo-fairy-beauty.jpg"
                  alt="Fairy Beauty"
                  width={260}
                  height={260}
                  className="relative rounded-2xl shadow-xl object-cover w-48 h-48 sm:w-64 sm:h-64"
                />
              </div>
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E] mb-5">Nosso Objetivo</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-6">
                {config.objectiveText || "Proporcionar experiências sensoriais completas com produtos de alta qualidade e atendimento humanizado."}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cuidado", "Bem-estar", "Autoestima", "Qualidade", "Carinho", "Experiência"].map((tag) => (
                  <span key={tag} className="badge badge-purple">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-[#3D2C4E] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#E6CBF7] mb-10">Nossos Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { emoji: "💜", title: "Cuidado", desc: "Cada produto e serviço desenvolvido com atenção e carinho." },
              { emoji: "🌿", title: "Naturalidade", desc: "Ingredientes selecionados com respeito à natureza." },
              { emoji: "✨", title: "Excelência", desc: "Qualidade em cada detalhe, do produto ao atendimento." },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <div className="text-5xl mb-4">{v.emoji}</div>
                <h3 className="font-heading text-xl font-semibold text-[#FBB8D9] mb-2">{v.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
