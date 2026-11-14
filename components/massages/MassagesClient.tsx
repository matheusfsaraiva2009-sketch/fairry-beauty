"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, ChevronDown, ChevronUp, Calendar, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ScheduleModal({ massage, onClose }: { massage: any; onClose: () => void }) {
  const addMassage = useCartStore((s) => s.addMassage);
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ date: "", time: "" });

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMassage(
      { id: massage.id, name: massage.name, price: massage.price, duration: massage.duration, image: massage.image },
      form.date, form.time
    );
    onClose();
    router.push("/carrinho");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-bold text-[#3D2C4E]">Agendar: {massage.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Data *</label>
            <input type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              required className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D2C4E] mb-2">Horário *</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((t) => (
                <button key={t} type="button" onClick={() => setForm({ ...form, time: t })}
                  className={`py-2 text-sm rounded-lg border transition-colors ${form.time === t ? "bg-[#E6CBF7] border-[#E6CBF7] text-[#3D2C4E] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#E6CBF7]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {session ? (
            <div className="bg-[#faf4ff] rounded-xl p-3 text-sm text-gray-600">
              Agendando como <strong className="text-[#3D2C4E]">{session.user?.name}</strong>
            </div>
          ) : (
            <div className="bg-[#FFF9C8] rounded-xl p-3 text-xs text-amber-700">
              Seus dados serão solicitados na finalização do pedido.
            </div>
          )}

          {massage.price && (
            <div className="bg-[#faf4ff] rounded-xl p-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">Valor da sessão</span>
              <span className="font-bold text-[#3D2C4E]">{formatPrice(massage.price)}</span>
            </div>
          )}
          <button type="submit" disabled={!form.date || !form.time}
            className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <Calendar size={16} /> Adicionar ao carrinho
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MassagesClient({ massages }: { massages: any[] }) {
  const [selectedMassage, setSelectedMassage] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white">
      {selectedMassage && <ScheduleModal massage={selectedMassage} onClose={() => setSelectedMassage(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="flex gap-2 mb-6">
          <Link href="/produtos" className="px-5 py-2 rounded-full text-sm font-semibold text-[#3D2C4E] border border-[#E6CBF7] hover:bg-[#E6CBF7] transition-colors">Produtos</Link>
          <Link href="/massagens" className="px-5 py-2 rounded-full text-sm font-semibold bg-[#3D2C4E] text-white shadow">Massagens</Link>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2C4E] mb-2">Massagens Terapêuticas</h1>
        <p className="text-gray-500 mb-10">Sessões individualizadas para o seu bem-estar. Agende agora!</p>

        {massages.length > 0 ? (
          <div className="space-y-6">
            {massages.map((m) => (
              <div key={m.id} id={m.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9]">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="text-8xl opacity-40">💆‍♀️</span></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  </div>
                  <div className="p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="font-heading text-2xl font-bold text-[#3D2C4E]">{m.name}</h2>
                        {m.available ? <span className="badge badge-green shrink-0">Disponível</span> : <span className="badge badge-red shrink-0">Indisponível</span>}
                      </div>
                      {m.objective && <p className="text-sm font-medium text-[#FBB8D9] italic mb-3">{m.objective}</p>}
                      {m.description && <p className="text-sm text-gray-500 leading-relaxed mb-4">{m.description}</p>}

                      {m.benefits && (
                        <div className="mb-4">
                          <button onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#3D2C4E] hover:text-[#FBB8D9]">
                            Ver benefícios {expanded === m.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {expanded === m.id && (
                            <div className="mt-3 bg-[#faf4ff] rounded-xl p-4 text-sm text-gray-600 leading-relaxed">{m.benefits}</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#f0e8ff]">
                      <div>
                        {m.duration && (
                          <span className="flex items-center gap-1 text-sm text-gray-500 mb-1"><Clock size={14} /> {m.duration} minutos</span>
                        )}
                        {m.price && <span className="text-2xl font-bold text-[#3D2C4E]">{formatPrice(m.price)}</span>}
                      </div>
                      {m.available && (
                        <button onClick={() => setSelectedMassage(m)} className="btn-primary">
                          <Calendar size={16} /> Agendar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#f0e8ff]">
            <div className="text-6xl mb-4">💆‍♀️</div>
            <h3 className="font-heading text-2xl text-[#3D2C4E] mb-2">Em breve</h3>
            <p className="text-gray-400">Os serviços de massagem serão cadastrados em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
