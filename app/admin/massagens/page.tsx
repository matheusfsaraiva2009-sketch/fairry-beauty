"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ImageUpload from "@/components/admin/ImageUpload";

function MassageForm({ massage, onSave, onClose }: { massage?: any; onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: massage?.name || "", description: massage?.description || "",
    objective: massage?.objective || "", benefits: massage?.benefits || "",
    duration: massage?.duration || "", price: massage?.price || "",
    image: massage?.image || "", available: massage?.available ?? true, sortOrder: massage?.sortOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const url = massage ? `/api/admin/massages/${massage.id}` : "/api/admin/massages";
    await fetch(url, { method: massage ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-bold text-[#3D2C4E]">{massage ? "Editar" : "Nova"} Massagem</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Nome *", k: "name" },
            { label: "Preço (R$)", k: "price", type: "number" },
            { label: "Duração (minutos)", k: "duration", type: "number" },
            { label: "Ordem de exibição", k: "sortOrder", type: "number" },
          ].map(({ label, k, type }: any) => (
            <div key={k}>
              <label className="block text-xs font-medium text-[#3D2C4E] mb-1">{label}</label>
              <input type={type || "text"} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={label.includes("*")}
                step={type === "number" && k === "price" ? "0.01" : undefined}
                className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
            </div>
          ))}
          <ImageUpload label="Imagem da massagem" value={form.image} onChange={url => setForm({ ...form, image: url })} />
          {[
            { label: "Descrição", k: "description", placeholder: "Descrição da massagem..." },
            { label: "Objetivo", k: "objective", placeholder: "Principal objetivo do procedimento..." },
            { label: "Benefícios", k: "benefits", placeholder: "Liste os principais benefícios..." },
          ].map(({ label, k, placeholder }) => (
            <div key={k}>
              <label className="block text-xs font-medium text-[#3D2C4E] mb-1">{label}</label>
              <textarea value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                rows={3} placeholder={placeholder}
                className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 accent-[#E6CBF7]" />
            <span className="text-sm text-[#3D2C4E]">Disponível para agendamento</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-60">{loading ? "Salvando..." : "Salvar"}</button>
            <button type="button" onClick={onClose} className="flex-1 btn-outline justify-center">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminMassagens() {
  const [massages, setMassages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const load = () => { setLoading(true); fetch("/api/admin/massages").then((r) => r.json()).then((d) => { setMassages(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(load, []);

  const toggleAvailable = async (m: any) => {
    await fetch(`/api/admin/massages/${m.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...m, available: !m.available }) });
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Excluir esta massagem?")) return;
    await fetch(`/api/admin/massages/${id}`, { method: "DELETE" }); load();
  };

  return (
    <div>
      {(creating || editing) && <MassageForm massage={editing} onSave={() => { setCreating(false); setEditing(null); load(); }} onClose={() => { setCreating(false); setEditing(null); }} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Massagens</h1>
          <p className="text-sm text-gray-400">{massages.length} serviço{massages.length !== 1 ? "s" : ""} cadastrado{massages.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus size={16} /> Nova Massagem</button>
      </div>

      {loading ? <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        : massages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
            <div className="text-5xl mb-3">💆‍♀️</div>
            <h3 className="font-heading text-lg text-[#3D2C4E] mb-2">Nenhuma massagem</h3>
            <button onClick={() => setCreating(true)} className="btn-primary mt-2">Cadastrar primeiro serviço</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#faf4ff]">
                  <tr>{["Massagem", "Duração", "Preço", "Disponível", "Ações"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {massages.map((m) => (
                    <tr key={m.id} className="hover:bg-[#faf4ff] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] overflow-hidden shrink-0">
                            {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">💆‍♀️</div>}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D2C4E]">{m.name}</p>
                            <p className="text-xs text-gray-400 max-w-xs truncate">{m.objective || m.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{m.duration ? <span className="flex items-center gap-1"><Clock size={12} />{m.duration}min</span> : "—"}</td>
                      <td className="px-4 py-3 font-semibold text-[#3D2C4E]">{m.price ? formatPrice(m.price) : "—"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleAvailable(m)}>
                          {m.available ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(m)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                          <button onClick={() => del(m.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
