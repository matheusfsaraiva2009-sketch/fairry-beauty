"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function CarrinhoPage() {
  const { products, massages, removeProduct, updateProductQuantity, removeMassage, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const total = getTotalPrice();
  const hasItems = products.length > 0 || massages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-[#3D2C4E]" size={28} />
          <h1 className="font-heading text-3xl font-bold text-[#3D2C4E]">Meu Carrinho</h1>
          {getTotalItems() > 0 && (
            <span className="badge badge-purple">{getTotalItems()} ite{getTotalItems() > 1 ? "ns" : "m"}</span>
          )}
        </div>

        {!hasItems ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#f0e8ff]">
            <ShoppingBag size={56} className="text-[#E6CBF7] mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-[#3D2C4E] mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-400 mb-8 text-sm">Adicione produtos ou agende uma massagem!</p>
            <div className="flex gap-3 justify-center">
              <Link href="/produtos" className="btn-primary">Ver Produtos</Link>
              <Link href="/massagens" className="btn-outline">Ver Massagens</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Products */}
              {products.length > 0 && (
                <div>
                  <h2 className="font-heading text-lg font-semibold text-[#3D2C4E] mb-3 flex items-center gap-2">
                    <ShoppingBag size={18} /> Produtos
                  </h2>
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f9f4ff] to-[#fce8f3] overflow-hidden shrink-0">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#3D2C4E] text-sm truncate">{p.name}</p>
                          {p.fragrance && <p className="text-xs text-gray-400">{p.fragrance}</p>}
                          <p className="text-sm font-semibold text-[#3D2C4E] mt-0.5">{formatPrice(p.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => updateProductQuantity(p.id, p.quantity - 1)} className="w-7 h-7 rounded-full border border-[#E6CBF7] flex items-center justify-center hover:bg-[#E6CBF7] transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium text-[#3D2C4E] w-5 text-center">{p.quantity}</span>
                          <button onClick={() => updateProductQuantity(p.id, p.quantity + 1)} className="w-7 h-7 rounded-full border border-[#E6CBF7] flex items-center justify-center hover:bg-[#E6CBF7] transition-colors">
                            <Plus size={12} />
                          </button>
                          <button onClick={() => removeProduct(p.id)} className="w-7 h-7 rounded-full text-red-400 hover:bg-red-50 flex items-center justify-center ml-1">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Massages */}
              {massages.length > 0 && (
                <div>
                  <h2 className="font-heading text-lg font-semibold text-[#3D2C4E] mb-3 flex items-center gap-2">
                    <Calendar size={18} /> Agendamentos
                  </h2>
                  <div className="space-y-3">
                    {massages.map((m) => (
                      <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] overflow-hidden shrink-0">
                          {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">💆‍♀️</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#3D2C4E] text-sm">{m.name}</p>
                          {m.date && m.time && (
                            <p className="text-xs text-gray-400">{new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")} às {m.time}</p>
                          )}
                          {m.price && <p className="text-sm font-semibold text-[#3D2C4E] mt-0.5">{formatPrice(m.price)}</p>}
                        </div>
                        <button onClick={() => removeMassage(m.id)} className="w-7 h-7 rounded-full text-red-400 hover:bg-red-50 flex items-center justify-center">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-[#f0e8ff] p-6 sticky top-20">
                <h2 className="font-heading text-lg font-bold text-[#3D2C4E] mb-5">Resumo do pedido</h2>
                <div className="space-y-3 mb-5">
                  {products.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[140px]">{p.name} x{p.quantity}</span>
                      <span className="font-medium">{formatPrice(p.price * p.quantity)}</span>
                    </div>
                  ))}
                  {massages.map((m) => (
                    <div key={m.id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[140px]">{m.name}</span>
                      <span className="font-medium">{formatPrice(m.price || 0)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#f0e8ff] pt-4 flex justify-between items-center mb-6">
                  <span className="font-semibold text-[#3D2C4E]">Total</span>
                  <span className="font-bold text-xl text-[#3D2C4E]">{formatPrice(total)}</span>
                </div>
                <Link href="/finalizar" className="w-full btn-primary justify-center mb-3">
                  Finalizar <ArrowRight size={16} />
                </Link>
                <button onClick={clearCart} className="w-full text-sm text-gray-400 hover:text-red-400 transition-colors py-1.5">
                  Limpar carrinho
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
