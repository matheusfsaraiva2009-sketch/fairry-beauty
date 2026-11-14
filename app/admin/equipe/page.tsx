"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, UserCircle2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  image: string | null;
  sortOrder: number;
}

const empty = (): Omit<TeamMember, "id"> => ({ name: "", role: "", image: null, sortOrder: 0 });

export default function AdminEquipePage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/team");
    setMembers(await r.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty()); setShowForm(true); setMsg(""); };
  const openEdit = (m: TeamMember) => { setEditing(m); setForm({ name: m.name, role: m.role || "", image: m.image, sortOrder: m.sortOrder }); setShowForm(true); setMsg(""); };
  const cancel = () => { setShowForm(false); setEditing(null); };

  const save = async () => {
    if (!form.name.trim()) { setMsg("Nome é obrigatório."); return; }
    setSaving(true);
    const url = editing ? `/api/admin/team/${editing.id}` : "/api/admin/team";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
    setShowForm(false);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este integrante?")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Equipe</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os integrantes exibidos na página Sobre.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#3D2C4E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#5a3f70] transition-colors">
          <Plus size={16} /> Novo Integrante
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-heading text-lg font-semibold text-[#3D2C4E] mb-5">
              {editing ? "Editar Integrante" : "Novo Integrante"}
            </h2>

            {/* Foto */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3D2C4E] mb-2">Foto</label>
              <ImageUpload
                value={form.image || ""}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                label="Foto do integrante"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Nome *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#E6CBF7] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CBF7] text-[#3D2C4E]"
                placeholder="Nome do integrante"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Cargo / Função</label>
              <input
                value={form.role || ""}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full border border-[#E6CBF7] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6CBF7] text-[#3D2C4E]"
                placeholder="Ex: Massagista, Fundadora..."
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Ordem de exibição</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="w-full border border-[#E6CBF7] rounded-xl px-3 py-2 text-sm focus:outline-none text-[#3D2C4E]"
              />
            </div>

            {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>}

            <div className="flex gap-3">
              <button onClick={cancel} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#3D2C4E] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#5a3f70] transition-colors flex items-center justify-center gap-2">
                <Save size={14} /> {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-[#f9f4ff] to-[#fce8f3] rounded-2xl">
          <UserCircle2 size={48} className="mx-auto text-[#E6CBF7] mb-4" />
          <h3 className="font-heading text-lg text-[#3D2C4E] mb-2">Nenhum integrante cadastrado</h3>
          <p className="text-gray-400 text-sm">Clique em "Novo Integrante" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-white border border-[#f0e8ff] rounded-2xl p-4 flex gap-4 items-center shadow-sm">
              {m.image ? (
                <img src={m.image} alt={m.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#E6CBF7]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#E6CBF7]/40 flex items-center justify-center flex-shrink-0">
                  <UserCircle2 size={32} className="text-[#3D2C4E]/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#3D2C4E] truncate">{m.name}</p>
                {m.role && <p className="text-sm text-gray-500 truncate">{m.role}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(m)} className="text-xs px-3 py-1.5 rounded-lg bg-[#E6CBF7]/40 text-[#3D2C4E] hover:bg-[#E6CBF7] transition-colors">Editar</button>
                <button onClick={() => remove(m.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
