interface Pyramid {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  topNotes?: string | null;
  heartNotes?: string | null;
  baseNotes?: string | null;
}

function PyramidVisual({ pyramid }: { pyramid: Pyramid }) {
  const empty = "A ser preenchido pela administradora";
  return (
    <div className="bg-white rounded-2xl border border-[#f0e8ff] overflow-hidden card-hover">
      {/* Fragrance image */}
      <div className="relative h-44 overflow-hidden">
        {pyramid.image ? (
          <img src={pyramid.image} alt={pyramid.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-brand flex items-center justify-center">
            <span className="text-5xl">{pyramid.name.includes("Morango") ? "🍓" : pyramid.name.includes("Melancia") ? "🍉" : "🌸"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2C4E]/70 to-transparent" />
        <h3 className="absolute bottom-4 left-4 font-heading text-2xl font-bold text-white">{pyramid.name}</h3>
      </div>

      <div className="p-5">
        {pyramid.description && (
          <p className="text-sm text-gray-500 italic mb-5 leading-relaxed">{pyramid.description}</p>
        )}

        {/* Pyramid shape */}
        <div className="space-y-2">
          {/* Top */}
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#FFF9C8] border-2 border-[#E6CBF7]" />
              <div className="w-0.5 flex-1 bg-[#E6CBF7]/40" />
            </div>
            <div className="flex-1 bg-[#FFF9C8] rounded-xl p-3 mb-1">
              <span className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider block mb-1">🔝 Notas de Saída</span>
              <p className="text-xs text-gray-600 leading-relaxed">{pyramid.topNotes || <span className="italic text-gray-400">{empty}</span>}</p>
            </div>
          </div>
          {/* Heart */}
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[#FBB8D9] border-2 border-[#E6CBF7]" />
              <div className="w-0.5 flex-1 bg-[#E6CBF7]/40" />
            </div>
            <div className="flex-1 bg-[#FBB8D9]/20 rounded-xl p-3 mb-1">
              <span className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider block mb-1">💗 Notas de Corpo</span>
              <p className="text-xs text-gray-600 leading-relaxed">{pyramid.heartNotes || <span className="italic text-gray-400">{empty}</span>}</p>
            </div>
          </div>
          {/* Base */}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#E6CBF7] border-2 border-[#3D2C4E]/30 mt-3 shrink-0" />
            <div className="flex-1 bg-[#E6CBF7]/30 rounded-xl p-3">
              <span className="text-xs font-semibold text-[#3D2C4E] uppercase tracking-wider block mb-1">🌿 Notas de Fundo</span>
              <p className="text-xs text-gray-600 leading-relaxed">{pyramid.baseNotes || <span className="italic text-gray-400">{empty}</span>}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OlfactivePyramids({ pyramids }: { pyramids: Pyramid[] }) {
  if (!pyramids.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pyramids.map((p) => <PyramidVisual key={p.id} pyramid={p} />)}
    </div>
  );
}
