"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

const statusOptions = ["pending", "confirmed", "cancelled", "delivered"];
const statusLabel: Record<string, string> = { pending: "Aguardando", confirmed: "Confirmado", cancelled: "Cancelado", delivered: "Entregue" };
const statusCls: Record<string, string> = { pending: "badge-yellow", confirmed: "badge-green", cancelled: "badge-red", delivered: "badge-blue" };

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => { setLoading(true); fetch("/api/admin/orders").then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Pedidos</h1>
          <p className="text-sm text-gray-400">{filtered.length} pedido{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...statusOptions].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? "bg-[#3D2C4E] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-[#E6CBF7]"}`}>
              {s === "all" ? "Todos" : statusLabel[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-gray-400">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(o => {
              const name = o.guestName || o.user?.name || "Cliente";
              const phone = o.guestPhone || o.user?.phone;
              const isOpen = expanded === o.id;
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-[#faf4ff] transition-colors"
                    onClick={() => setExpanded(isOpen ? null : o.id)}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div>
                        <p className="font-medium text-[#3D2C4E] text-sm">{name}</p>
                        {phone && <p className="text-xs text-gray-400">{phone}</p>}
                        <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`badge ${statusCls[o.status] || "badge-purple"} text-xs hidden sm:inline-flex`}>{statusLabel[o.status] || o.status}</span>
                      <span className="font-bold text-[#3D2C4E]">{formatPrice(o.total)}</span>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-[#f0e8ff]">
                      <div className="mt-4 space-y-2 mb-4">
                        {o.items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.product?.name} <span className="text-gray-400">×{item.quantity}</span></span>
                            <span className="font-medium text-[#3D2C4E]">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        {o.notes && <p className="text-xs text-gray-400 italic bg-[#faf4ff] rounded-lg p-2 mt-2">Obs: {o.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-gray-500">Status:</label>
                        <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="text-sm border border-[#E6CBF7] rounded-lg px-3 py-1.5 text-[#3D2C4E] bg-white">
                          {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
