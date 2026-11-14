"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, Heart, ShoppingBag, Calendar,
  Users, Settings, LogOut, Menu, X, Sparkles, ArrowLeft, UserCircle2
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/massagens", icon: Heart, label: "Massagens" },
  { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/agendamentos", icon: Calendar, label: "Agendamentos" },
  { href: "/admin/piramides", icon: Sparkles, label: "Pirâmides Olfativas" },
  { href: "/admin/equipe", icon: UserCircle2, label: "Equipe" },
  { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/admin");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.push("/");
  }, [status, session, router]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#E6CBF7] border-t-[#FBB8D9] rounded-full animate-spin" />
    </div>
  );
  if (!session || (session.user as any).role !== "admin") return null;

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href) && (!item.exact || pathname === item.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-purple-800">
        <h1 className="font-heading text-lg font-bold text-[#E6CBF7]">Aura & Essência</h1>
        <p className="text-xs text-purple-300 mt-0.5">Painel Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(item) ? "bg-[#E6CBF7]/20 text-[#E6CBF7]" : "text-purple-200 hover:bg-white/10 hover:text-white"
            }`}>
            <item.icon size={17} /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-purple-800 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-300 hover:text-white hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} /> Ver site
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-900/30 transition-colors">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 bg-[#3D2C4E] flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 h-full bg-[#3D2C4E] flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-5 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 text-gray-500 hover:text-gray-700">
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#3D2C4E]">{session.user?.name}</p>
              <p className="text-xs text-gray-400">Administradora</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center">
              <span className="text-xs font-bold text-[#3D2C4E]">{session.user?.name?.[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
