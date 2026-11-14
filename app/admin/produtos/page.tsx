"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Star, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ImageUpload from "@/components/admin/ImageUpload";

function ProductForm({ product, onSave, onClose }: { product?: any; onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "", description: product?.description || "",
    price: product?.price || "", image: product?.image || "",
    characteristics: product?.characteristics || "", fragrance: product?.fragrance || "",
    available: product?.available ?? true, featured: product?.featured ?? false,
    sortOrder: product?.sortOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (!res.ok) { setError("Erro ao salvar."); return; }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-bold text-[#3D2C4E]">{product ? "Editar" : "Novo"} Produto</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Nome *", k: "name", placeholder: "Nome do produto" },
            { label: "Preço *", k: "price", placeholder: "0.00", type: "number" },
            { label: "Fragrância", k: "fragrance", placeholder: "Ex: Morango Silvestre" },
            { label: "Ordem de exibição", k: "sortOrder", placeholder: "0", type: "number" },
          ].map(({ label, k, placeholder, type }) => (
            <div key={k}>
              <label className="block text-xs font-medium text-[#3D2C4E] mb-1">{label}</label>
              <input type={type || "text"} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                placeholder={placeholder} required={label.includes("*")}
                step={type === "number" && k === "price" ? "0.01" : undefined}
                className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
            </div>
          ))}
          <ImageUpload label="Imagem do produto" value={form.image} onChange={url => setForm({ ...form, image: url })} />
          <div>
            <label className="block text-xs font-medium text-[#3D2C4E] mb-1">Descrição *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              required rows={3} placeholder="Descrição do produto"
              className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3D2C4E] mb-1">Características</label>
            <textarea value={form.characteristics} onChange={(e) => setForm({ ...form, characteristics: e.target.value })}
              rows={2} placeholder="Ingredientes, volume, etc."
              className="w-full px-3 py-2 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-4 h-4 accent-[#E6CBF7]" />
              <span className="text-sm text-[#3D2C4E]">Disponível</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#FBB8D9]" />
              <span className="text-sm text-[#3D2C4E]">Destaque</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center disabled:opacity-60">
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-outline justify-center">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProdutos() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const load = () => { setLoading(true); fetch("/api/admin/products").then((r) => r.json()).then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(load, []);

  const toggleAvailable = async (p: any) => {
    await fetch(`/api/admin/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, available: !p.available }) });
    load();
  };
  const deleteProduct = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      {(creating || editing) && (
        <ProductForm product={editing} onSave={() => { setCreating(false); setEditing(null); load(); }} onClose={() => { setCreating(false); setEditing(null); }} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Produtos</h1>
          <p className="text-sm text-gray-400">{products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8ff]">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="font-heading text-lg text-[#3D2C4E] mb-2">Nenhum produto</h3>
          <button onClick={() => setCreating(true)} className="btn-primary mt-2">Cadastrar primeiro produto</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf4ff] text-left">
                <tr>
                  {["Produto", "Fragrância", "Preço", "Disponível", "Destaque", "Ações"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf4ff] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f0e8ff] to-[#fce8f3] overflow-hidden shrink-0">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🧴</div>}
                        </div>
                        <div>
                          <p className="font-medium text-[#3D2C4E]">{p.name}</p>
                          <p className="text-xs text-gray-400 max-w-xs truncate">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.fragrance || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-[#3D2C4E]">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAvailable(p)}>
                        {p.available ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? <Star size={16} className="text-amber-400 fill-amber-400" /> : <Star size={16} className="text-gray-200" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
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
