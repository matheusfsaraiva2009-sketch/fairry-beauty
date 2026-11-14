"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: any }) {
  const addProduct = useCartStore((s) => s.addProduct);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addProduct({ id: product.id, name: product.name, price: product.price, image: product.image, fragrance: product.fragrance });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-[#f9f4ff] to-[#fce8f3] overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-40">🧴</div>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 badge badge-yellow text-xs font-semibold">⭐ Destaque</span>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge badge-red font-medium">Indisponível</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.fragrance && (
          <span className="badge badge-pink text-xs mb-2 inline-block">{product.fragrance}</span>
        )}
        <h3 className="font-heading font-semibold text-[#3D2C4E] text-base leading-snug mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#3D2C4E] text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
              added
                ? "bg-[#C6EED6] text-green-700"
                : product.available
                ? "bg-[#E6CBF7] text-[#3D2C4E] hover:bg-[#FBB8D9] hover:shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {added ? <><Check size={14} /> Adicionado</> : <><Plus size={14} /> Adicionar</>}
          </button>
        </div>
      </div>
    </div>
  );
}
