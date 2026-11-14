"use client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function ProductsClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState("");
  const [fragFilter, setFragFilter] = useState("all");
  const totalItems = useCartStore((s) => s.getTotalItems());

  const fragrances = Array.from(new Set(products.filter((p) => p.fragrance).map((p) => p.fragrance)));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchFrag = fragFilter === "all" || p.fragrance === fragFilter;
    return matchSearch && matchFrag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex gap-2 mb-5">
              <Link href="/produtos" className="px-5 py-2 rounded-full text-sm font-semibold bg-[#3D2C4E] text-white shadow">Produtos</Link>
              <Link href="/massagens" className="px-5 py-2 rounded-full text-sm font-semibold text-[#3D2C4E] border border-[#E6CBF7] hover:bg-[#E6CBF7] transition-colors">Massagens</Link>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E]">Nossos Produtos</h1>
            <p className="text-gray-500 mt-1">{filtered.length} produto{filtered.length !== 1 ? "s" : ""} disponíve{filtered.length !== 1 ? "is" : "l"}</p>
          </div>
          <Link href="/carrinho" className="flex items-center gap-2 btn-primary shrink-0 relative">
            <ShoppingBag size={18} />
            Ver Carrinho
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold text-white bg-[#3D2C4E] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Buscar produto..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E6CBF7] rounded-full bg-white focus:ring-0 text-[#3D2C4E] placeholder:text-gray-400"
            />
          </div>
          {fragrances.length > 0 && (
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={fragFilter} onChange={(e) => setFragFilter(e.target.value)}
                className="pl-8 pr-8 py-2.5 text-sm border border-[#E6CBF7] rounded-full bg-white text-[#3D2C4E] appearance-none cursor-pointer"
              >
                <option value="all">Todas as fragrâncias</option>
                {fragrances.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading text-xl text-[#3D2C4E] mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-400 text-sm">Tente outros termos de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
