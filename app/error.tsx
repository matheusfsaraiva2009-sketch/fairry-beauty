"use client";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#faf4ff] to-white px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="font-heading text-3xl font-bold text-[#3D2C4E] mb-3">Algo deu errado</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Tentar novamente</button>
          <Link href="/" className="btn-outline">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
}
