import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#faf4ff] to-white px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🌸</div>
        <h1 className="font-heading text-5xl font-bold text-[#3D2C4E] mb-3">404</h1>
        <h2 className="font-heading text-xl text-[#3D2C4E] mb-4">Página não encontrada</h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/" className="btn-primary">Voltar ao início</Link>
      </div>
    </div>
  );
}
