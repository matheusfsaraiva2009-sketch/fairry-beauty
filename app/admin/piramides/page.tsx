"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, X, CheckCircle, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

function PyramidForm({ pyramid, onSave, onClose }: { pyramid?: any; onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: pyramid?.name || "", description: pyramid?.description || "",
    image: pyramid?.image || "", topNotes: pyramid?.topNotes || "",
    heartNotes: pyramid?.heartNotes || "", baseNotes: pyramid?.baseNotes || "",
    sortOrder: pyramid?.sortOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const url = pyramid ? `/api/admin/pyramids/${pyramid.id}` : "/api/admin/pyramids";
    await fetch(url, { method: pyramid ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-bold text-[#3D2C4E]">{pyramid ? "Editar" : "Nova"} Pirâmide Olfativa</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#3D2C4E] mb-1">Nome da fragrância *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Morango Silvestre" className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
          </div>
          <ImageUpload label="Imagem da fragrância" value={form.image} onChange={url => setForm({ ...form, image: url })} />
          <div>
            <label className="block text-xs font-medium text-[#3D2C4E] mb-1">Descrição</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2} placeholder="Descreva a experiência olfativa..."
              className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div className="bg-[#FFF9C8]/50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">🔝 Notas de Saída (Topo)</p>
            <textarea value={form.topNotes} onChange={e => setForm({ ...form, topNotes: e.target.value })}
              rows={2} placeholder="Ex: Morango fresco, Frutas vermelhas..." className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div className="bg-[#FBB8D9]/20 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">💗 Notas de Corpo (Coração)</p>
            <textarea value={form.heartNotes} onChange={e => setForm({ ...form, heartNotes: e.target.value })}
              rows={2} placeholder="Ex: Flor de laranjeira, Jasmim..." className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div className="bg-[#E6CBF7]/30 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">🌿 Notas de Fundo (Base)</p>
            <textarea value={form.baseNotes} onChange={e => setForm({ ...form, baseNotes: e.target.value })}
              rows={2} placeholder="Ex: Baunilha, Almíscar..." className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-60">{loading ? "Salvando..." : "Salvar"}</button>
            <button type="button" onClick={onClose} className="flex-1 btn-outline justify-center">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPiramides() {
  const [pyramids, setPyramids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const load = () => { setLoading(true); fetch("/api/admin/pyramids").then(r => r.json()).then(d => { setPyramids(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(load, []);

  const del = async (id: string) => {
    if (!confirm("Excluir esta pirâmide?")) return;
    await fetch(`/api/admin/pyramids/${id}`, { method: "DELETE" }); load();
  };

  return (
    <div>
      {(creating || editing) && <PyramidForm pyramid={editing} onSave={() => { setCreating(false); setEditing(null); load(); }} onClose={() => { setCreating(false); setEditing(null); }} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Pirâmides Olfativas</h1>
          <p className="text-sm text-gray-400">Gerencie as fragrâncias dos seus hidratantes</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus size={16} /> Nova Fragrância</button>
      </div>

      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
        : pyramids.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
            <div className="text-5xl mb-3">🌸</div>
            <h3 className="font-heading text-lg text-[#3D2C4E] mb-2">Nenhuma fragrância</h3>
            <button onClick={() => setCreating(true)} className="btn-primary mt-2">Cadastrar fragrância</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pyramids.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#f0e8ff] overflow-hidden shadow-sm">
                <div className="relative h-32 bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9]">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <h3 className="absolute bottom-3 left-3 font-heading text-lg font-bold text-white">{p.name}</h3>
                </div>
                <div className="p-4 space-y-2">
                  {[["🔝 Topo", p.topNotes], ["💗 Corpo", p.heartNotes], ["🌿 Base", p.baseNotes]].map(([label, notes]) => (
                    <div key={label as string}>
                      <span className="text-xs font-semibold text-[#3D2C4E]">{label as string}:</span>{" "}
                      <span className="text-xs text-gray-500">{(notes as string) || <em className="text-gray-300">vazio</em>}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2 border-t border-[#f0e8ff]">
                    <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil size={13} /> Editar
                    </button>
                    <button onClick={() => del(p.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={13} /> Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
