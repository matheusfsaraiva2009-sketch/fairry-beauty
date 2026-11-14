"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import MassageCard from "@/components/massages/MassageCard";

interface Props {
  products: any[];
  massages: any[];
  config: Record<string, string>;
}

export default function HomeClient({ products, massages, config }: Props) {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-hero">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#FBB8D9]/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-[#B3E1F8]/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-[#C6EED6]/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Logo — esquerda */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] opacity-25 blur-2xl scale-110" />
                <Image
                  src="/logo-fairy-beauty.jpg"
                  alt="Fairy Beauty"
                  width={340}
                  height={340}
                  className="relative rounded-3xl shadow-2xl object-cover w-64 h-64 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px]"
                  priority
                />
              </div>
            </div>

            {/* Texto — direita */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-[#3D2C4E] font-medium mb-6 border border-[#E6CBF7]/50">
                <Sparkles size={14} className="text-[#FBB8D9]" />
                {config.tagline || "Cuidado Pessoal & Bem-Estar"}
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3D2C4E] leading-tight mb-6">
                {config.heroTitle || "Harmonia e Bem-Estar para o Seu Corpo e Mente"}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                {config.heroSubtitle || "Descubra nossa linha exclusiva de cosméticos aromáticos e agende sessões de massoterapia revigorantes."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/produtos" className="btn-primary">
                  Ver Produtos <ArrowRight size={18} />
                </Link>
                <Link href="/massagens" className="btn-outline">
                  Conhecer Massagens
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ─── PRODUCTS PREVIEW ─── */}
      <section className="py-20 gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E] mb-2">Nossos Produtos</h2>
              <p className="text-gray-500">Hidratantes, velas e cosméticos artesanais com fragrâncias exclusivas.</p>
            </div>
            <Link href="/produtos" className="btn-outline shrink-0">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
              <div className="text-5xl mb-4">🌸</div>
              <h3 className="font-heading text-xl text-[#3D2C4E] mb-2">Em breve</h3>
              <p className="text-gray-400 text-sm">Nossos produtos serão cadastrados em breve. Volte logo!</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── MASSAGES PREVIEW ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E] mb-2">Massagens Terapêuticas</h2>
              <p className="text-gray-500">Sessões individualizadas para alívio, relaxamento e bem-estar.</p>
            </div>
            <Link href="/massagens" className="btn-outline shrink-0">
              Agendar <ArrowRight size={16} />
            </Link>
          </div>
          {massages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {massages.map((m) => <MassageCard key={m.id} massage={m} compact />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-[#f9f4ff] to-[#fce8f3] rounded-2xl">
              <div className="text-5xl mb-4">💆‍♀️</div>
              <h3 className="font-heading text-xl text-[#3D2C4E] mb-2">Em breve</h3>
              <p className="text-gray-400 text-sm">Os serviços de massagem serão cadastrados em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT TEASER ─── */}
      <section className="py-20 bg-gradient-to-br from-[#E6CBF7]/20 to-[#FBB8D9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E] mb-5">Nossa História</h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base">
                {config.aboutText || "Dedicamo-nos a criar rituais de autocuidado que despertam sensações e restauram energias."}
              </p>
              <Link href="/sobre" className="btn-primary">
                Conheça mais <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#f0e8ff]">
              <h3 className="font-heading text-2xl font-semibold text-[#3D2C4E] mb-4">Nosso Objetivo</h3>
              <p className="text-gray-600 leading-relaxed">
                {config.objectiveText || "Proporcionar experiências sensoriais completas com produtos de alta qualidade e atendimento humanizado."}
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                {["Cuidado", "Bem-estar", "Autoestima", "Qualidade"].map((tag) => (
                  <span key={tag} className="badge badge-purple text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
