import { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Coluna esquerda — logo */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f9f4ff 0%, #fce8f3 50%, #E6CBF7 100%)" }}>
        {/* Fundo decorativo */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #FBB8D9 0%, transparent 60%), radial-gradient(circle at 70% 20%, #B3E1F8 0%, transparent 50%), radial-gradient(circle at 60% 80%, #C6EED6 0%, transparent 50%)" }} />

        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <Image
            src="/logo-fairy-beauty.jpg"
            alt="Fairy Beauty"
            width={380}
            height={380}
            className="rounded-3xl shadow-2xl object-cover"
            priority
          />
          <p className="mt-6 text-[#3D2C4E] text-sm font-medium opacity-70 tracking-widest uppercase">
            Painel Administrativo
          </p>
        </div>

        {/* Sparkles decorativos */}
        <div className="absolute top-10 left-10 text-[#FBB8D9] text-3xl opacity-40 select-none">✦</div>
        <div className="absolute bottom-16 right-14 text-[#E6CBF7] text-2xl opacity-50 select-none">✦</div>
        <div className="absolute top-1/3 right-8 text-[#B3E1F8] text-xl opacity-40 select-none">✦</div>
      </div>

      {/* Coluna direita — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        {/* Logo pequena no mobile */}
        <div className="lg:hidden mb-6 flex flex-col items-center">
          <Image
            src="/logo-fairy-beauty.jpg"
            alt="Fairy Beauty"
            width={120}
            height={120}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Área Restrita</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
