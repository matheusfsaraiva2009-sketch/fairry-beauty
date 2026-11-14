"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { MessageCircle, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FinalizarPage() {
  const { data: session } = useSession();
  const { products, massages, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [config, setConfig] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/public/config").then((r) => r.json()).then(setConfig);
    if (session?.user) {
      setForm((f) => ({ ...f, name: session.user.name || "", email: session.user.email || "" }));
    }
  }, [session]);

  if (!mounted) return null;

  const hasItems = products.length > 0 || massages.length > 0;
  if (!hasItems && !sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="font-heading text-2xl text-[#3D2C4E] mb-2">Carrinho vazio</h2>
          <Link href="/produtos" className="btn-primary mt-4 inline-flex">Ver Produtos</Link>
        </div>
      </div>
    );
  }

  const buildMessage = () => {
    const name = session?.user?.name || form.name;
    const phone = form.phone;
    let msg = `Olá! Gostaria de realizar um pedido. 😊\n\n`;
    msg += `*Cliente:* ${name}\n`;
    if (phone) msg += `*Telefone:* ${phone}\n`;
    if (form.email) msg += `*Email:* ${form.email}\n\n`;

    if (products.length > 0) {
      msg += `*🛍️ Produtos selecionados:*\n`;
      products.forEach((p) => {
        msg += `• ${p.name} — Qtd: ${p.quantity} — ${formatPrice(p.price * p.quantity)}\n`;
      });
    }
    if (massages.length > 0) {
      msg += `\n*💆 Agendamentos:*\n`;
      massages.forEach((m) => {
        msg += `• ${m.name}`;
        if (m.date) msg += ` — Data: ${new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")}`;
        if (m.time) msg += ` às ${m.time}`;
        if (m.price) msg += ` — ${formatPrice(m.price)}`;
        msg += `\n`;
      });
    }
    msg += `\n*Total: ${formatPrice(getTotalPrice())}*`;
    if (form.notes) msg += `\n\n*Observações:* ${form.notes}`;
    msg += `\n\nAguardo o retorno. Obrigada! 🌸`;
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to DB
      if (products.length > 0) {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestName: form.name, guestPhone: form.phone, guestEmail: form.email,
            notes: form.notes,
            items: products.map((p) => ({ productId: p.id, quantity: p.quantity })),
          }),
        });
      }
      if (massages.length > 0) {
        for (const m of massages) {
          await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              guestName: form.name, guestPhone: form.phone, guestEmail: form.email,
              massageId: m.id, date: m.date, time: m.time, notes: form.notes,
            }),
          });
        }
      }
      const wa = config.whatsapp?.replace(/\D/g, "") || "";
      const link = generateWhatsAppLink(wa, buildMessage());
      clearCart();
      setSent(true);
      setTimeout(() => { window.open(link, "_blank"); }, 400);
    } catch { } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="text-[#C6EED6] mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-[#3D2C4E] mb-2">Pedido registrado!</h2>
          <p className="text-gray-500 text-sm mb-6">O WhatsApp foi aberto com sua mensagem. Aguarde a confirmação da administradora. 🌸</p>
          <Link href="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/carrinho" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3D2C4E] mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar ao carrinho
        </Link>
        <h1 className="font-heading text-3xl font-bold text-[#3D2C4E] mb-8">Finalizar Pedido</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-[#f0e8ff] p-5 mb-6">
          <h2 className="font-heading text-base font-semibold text-[#3D2C4E] mb-4">Resumo</h2>
          {products.map((p) => (
            <div key={p.id} className="flex justify-between text-sm py-1.5 border-b border-[#f9f4ff] last:border-0">
              <span className="text-gray-600">{p.name} x{p.quantity}</span>
              <span className="font-medium text-[#3D2C4E]">{formatPrice(p.price * p.quantity)}</span>
            </div>
          ))}
          {massages.map((m) => (
            <div key={m.id} className="flex justify-between text-sm py-1.5 border-b border-[#f9f4ff] last:border-0">
              <span className="text-gray-600">{m.name}{m.date ? ` — ${new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")} ${m.time}` : ""}</span>
              <span className="font-medium text-[#3D2C4E]">{formatPrice(m.price || 0)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-[#3D2C4E] mt-3 pt-2 border-t border-[#E6CBF7]">
            <span>Total</span><span>{formatPrice(getTotalPrice())}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#f0e8ff] p-6 space-y-4">
          <h2 className="font-heading text-base font-semibold text-[#3D2C4E] mb-2">Seus dados</h2>
          {!session && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Nome completo *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome" className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1">WhatsApp *</label>
                <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999" className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Email (opcional)</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com" className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E]" />
              </div>
            </>
          )}
          {session && (
            <div className="bg-[#faf4ff] rounded-xl p-3 text-sm text-gray-600">
              Logado como <strong className="text-[#3D2C4E]">{session.user?.name}</strong> ({session.user?.email})
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#3D2C4E] mb-1">Observações</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} placeholder="Alguma observação? Preferências, horário alternativo..." 
              className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none" />
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2 bg-[#FFF9C8] rounded-xl p-3">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              O envio da mensagem no WhatsApp <strong>não confirma automaticamente</strong> seu pedido ou agendamento. A confirmação será realizada pela administradora após o contato.
            </p>
          </div>

          <button type="submit" disabled={loading || (!session && (!form.name || !form.phone))}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-semibold text-base py-4 rounded-2xl hover:bg-green-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            <MessageCircle size={22} />
            {loading ? "Registrando pedido..." : "Finalizar pelo WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
