"use client";
import { useEffect, useState } from "react";
import { Package, Heart, ShoppingBag, Calendar, Clock, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  pending: "Aguardando", confirmed: "Confirmado", cancelled: "Cancelado",
  delivered: "Entregue", completed: "Realizado"
};

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-[#3D2C4E]" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#3D2C4E]">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard").then((r) => r.json()).then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Produtos" value={data?.products ?? 0} color="bg-[#E6CBF7]" />
        <StatCard icon={Heart} label="Massagens" value={data?.massages ?? 0} color="bg-[#FBB8D9]" />
        <StatCard icon={ShoppingBag} label="Pedidos Pendentes" value={data?.pendingOrders ?? 0} color="bg-[#FFF9C8]" />
        <StatCard icon={Calendar} label="Agendamentos Pendentes" value={data?.pendingAppointments ?? 0} color="bg-[#B3E1F8]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <ShoppingBag size={17} className="text-[#3D2C4E]" />
            <h2 className="font-heading text-base font-semibold text-[#3D2C4E]">Pedidos Recentes</h2>
          </div>
          {data?.recentOrders?.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {data.recentOrders.map((o: any) => (
                <div key={o.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3D2C4E]">{o.guestName || o.user?.name || "Cliente"}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#3D2C4E]">{formatPrice(o.total)}</p>
                    <span className={`text-xs badge ${o.status === "pending" ? "badge-yellow" : o.status === "confirmed" ? "badge-green" : "badge-red"}`}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-400">Nenhum pedido ainda</div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar size={17} className="text-[#3D2C4E]" />
            <h2 className="font-heading text-base font-semibold text-[#3D2C4E]">Agendamentos Recentes</h2>
          </div>
          {data?.recentAppointments?.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {data.recentAppointments.map((a: any) => (
                <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#3D2C4E]">{a.guestName || a.user?.name || "Cliente"}</p>
                    <p className="text-xs text-gray-400">{a.massage?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                      <Clock size={11} /> {new Date(a.date).toLocaleDateString("pt-BR")}{a.time && ` ${a.time}`}
                    </p>
                    <span className={`text-xs badge ${a.status === "pending" ? "badge-yellow" : a.status === "confirmed" ? "badge-green" : "badge-red"}`}>
                      {statusLabel[a.status] || a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-gray-400">Nenhum agendamento ainda</div>
          )}
        </div>
      </div>
    </div>
  );
}
