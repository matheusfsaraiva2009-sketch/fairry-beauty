"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, ShoppingBag, Calendar, LogOut, Settings, ArrowLeft } from "lucide-react";

export default function UserLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=" + pathname);
  }, [status, router, pathname]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#E6CBF7] border-t-[#FBB8D9] rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const navItems = [
    { href: "/perfil", icon: User, label: "Meu Perfil" },
    { href: "/pedidos", icon: ShoppingBag, label: "Meus Pedidos" },
    { href: "/agendamentos", icon: Calendar, label: "Agendamentos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ff] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3D2C4E] mb-8 transition-colors">
          <ArrowLeft size={15} /> Voltar ao site
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#f0e8ff] p-5 sticky top-24">
              <div className="text-center mb-5 pb-5 border-b border-[#f0e8ff]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center mx-auto mb-2">
                  <User size={22} className="text-[#3D2C4E]" />
                </div>
                <p className="font-medium text-[#3D2C4E] text-sm">{session.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === item.href ? "bg-[#E6CBF7] text-[#3D2C4E]" : "text-gray-500 hover:bg-[#faf4ff] hover:text-[#3D2C4E]"
                    }`}>
                    <item.icon size={16} /> {item.label}
                  </Link>
                ))}
                {(session.user as any)?.role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
                    <Settings size={16} /> Painel Admin
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-colors">
                  <LogOut size={16} /> Sair
                </button>
              </nav>
            </div>
          </aside>
          {/* Main */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
