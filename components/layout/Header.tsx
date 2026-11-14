"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Config { brandName?: string; whatsapp?: string; }

export default function Header({ config }: { config?: Config }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const totalItems = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/produtos", label: "Produtos" },
    { href: "/massagens", label: "Massagens" },
    { href: "/sobre", label: "Sobre" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-[#3D2C4E] tracking-wide">
              {config?.brandName || "Aura & Essência"}
            </span>
            <span className="text-xs text-[#FBB8D9]">✦</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative pb-1 ${
                  isActive(link.href)
                    ? "text-[#3D2C4E] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E6CBF7] after:rounded"
                    : "text-gray-500 hover:text-[#3D2C4E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/carrinho" className="relative p-2 text-gray-600 hover:text-[#3D2C4E] transition-colors">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-bold text-white bg-[#FBB8D9] rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {session ? (
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#3D2C4E] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] flex items-center justify-center">
                    <User size={14} className="text-[#3D2C4E]" />
                  </div>
                  <span className="hidden lg:inline">{session.user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#f0e8ff] py-1 z-50">
                    <Link href="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 font-medium">
                      <Settings size={15} /> Painel Admin
                    </Link>
                    <hr className="my-1 border-[#f0e8ff]" />
                    <button onClick={() => { setUserMenu(false); signOut({ callbackUrl: "/" }); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={15} /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#f0e8ff] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href) ? "bg-[#E6CBF7] text-[#3D2C4E]" : "text-gray-600 hover:bg-[#faf4ff]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <>
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-purple-600 font-medium hover:bg-purple-50">Painel Admin</Link>
              <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50">Sair</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
