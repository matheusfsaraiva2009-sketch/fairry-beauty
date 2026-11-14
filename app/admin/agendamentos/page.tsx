"use client";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];
const statusLabel: Record<string, string> = { pending: "Aguardando", confirmed: "Confirmado", cancelled: "Cancelado", completed: "Realizado" };
const statusCls: Record<string, string> = { pending: "badge-yellow", confirmed: "badge-green", cancelled: "badge-red", completed: "badge-blue" };

export default function AdminAgendamentos() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => { setLoading(true); fetch("/api/admin/appointments").then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/appointments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const filtered = filter === "all" ? items : items.filter(a => a.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Agendamentos</h1>
          <p className="text-sm text-gray-400">{filtered.length} agendamento{filtered.length !== 1 ? "s" : ""}</p>
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
            <div className="text-5xl mb-3">📅</div>
            <p className="text-gray-400">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => {
              const name = a.guestName || a.user?.name || "Cliente";
              const phone = a.guestPhone || a.user?.phone;
              const isOpen = expanded === a.id;
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-[#faf4ff] transition-colors"
                    onClick={() => setExpanded(isOpen ? null : a.id)}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center shrink-0 text-lg">
                        💆‍♀️
                      </div>
                      <div>
                        <p className="font-medium text-[#3D2C4E] text-sm">{name}</p>
                        <p className="text-xs text-gray-400">{a.massage?.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(a.date).toLocaleDateString("pt-BR")}{a.time && ` às ${a.time}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`badge ${statusCls[a.status] || "badge-purple"} text-xs hidden sm:inline-flex`}>{statusLabel[a.status] || a.status}</span>
                      {a.massage?.price && <span className="font-bold text-[#3D2C4E] text-sm">{formatPrice(a.massage.price)}</span>}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-[#f0e8ff]">
                      <div className="mt-4 mb-4 text-sm text-gray-600 space-y-1">
                        {phone && <p>📱 {phone}</p>}
                        {a.guestEmail && <p>✉️ {a.guestEmail}</p>}
                        {a.notes && <p className="text-xs italic bg-[#faf4ff] rounded-lg p-2 mt-2">Obs: {a.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-gray-500">Status:</label>
                        <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}
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
