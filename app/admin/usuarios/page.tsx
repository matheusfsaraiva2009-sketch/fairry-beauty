"use client";
import { useEffect, useState } from "react";
import { Users, Plus, X, Eye, EyeOff, Trash2, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

interface NewAdmin { name: string; email: string; password: string; }

export default function AdminUsuarios() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewAdmin>({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetch("/api/admin/users")
      .then(r => r.json())
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const openModal = () => { setForm({ name: "", email: "", password: "" }); setError(""); setShowModal(true); };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "admin" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao criar usuário."); setSaving(false); return; }
      setShowModal(false);
      setSuccess("Admin criado com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
      load();
    } catch { setError("Erro de conexão."); }
    setSaving(false);
  };

  const deleteUser = async (user: any) => {
    if ((session?.user as any)?.id === user.id) { alert("Não é possível excluir sua própria conta."); return; }
    if (!confirm(`Excluir o admin "${user.name}"? Essa ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    load();
  };

  const admins = users.filter(u => u.role === "admin");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Administradores</h1>
          <p className="text-sm text-gray-400">{admins.length} admin{admins.length !== 1 ? "s" : ""} cadastrado{admins.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openModal} className="btn-primary">
          <Plus size={16} /> Novo Admin
        </button>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <ShieldCheck size={16} /> {success}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Nenhum admin cadastrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf4ff]">
                <tr>
                  {["Admin", "Email", "Desde", "Ações"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map(u => (
                  <tr key={u.id} className="hover:bg-[#faf4ff] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center text-sm font-bold text-[#3D2C4E] shrink-0">
                          {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-[#3D2C4E]">{u.name || "—"}</p>
                          <span className="text-xs text-purple-500 font-medium">Admin</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      {(session?.user as any)?.id !== u.id ? (
                        <button onClick={() => deleteUser(u)}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={12} /> Remover
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300 italic">você</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal criar admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#3D2C4E]" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-[#3D2C4E]">Novo Administrador</h2>
                <p className="text-xs text-gray-400">Acesso completo ao painel</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={createAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1.5">Nome</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1.5">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@exemplo.com"
                  className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} required value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="w-full px-4 pr-11 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 btn-outline justify-center">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary justify-center disabled:opacity-60">
                  {saving ? "Criando..." : "Criar Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
