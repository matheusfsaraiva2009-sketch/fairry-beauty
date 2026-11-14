"use client";
import { useState } from "react";
import { Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function MassageCard({ massage, compact, onSchedule }: { massage: any; compact?: boolean; onSchedule?: (m: any) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover ${compact ? "" : "shadow-sm"}`}>
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#E6CBF7] to-[#FBB8D9] overflow-hidden">
        {massage.image ? (
          <img src={massage.image} alt={massage.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-50">💆‍♀️</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          {massage.duration && (
            <span className="flex items-center gap-1 text-white/90 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              <Clock size={12} /> {massage.duration} min
            </span>
          )}
          {massage.price && (
            <span className="text-white font-bold text-lg">{formatPrice(massage.price)}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-semibold text-[#3D2C4E] text-lg leading-snug">{massage.name}</h3>
          {massage.available ? (
            <span className="badge badge-green text-xs shrink-0">Disponível</span>
          ) : (
            <span className="badge badge-red text-xs shrink-0">Indisponível</span>
          )}
        </div>

        {massage.objective && (
          <p className="text-sm text-[#FBB8D9] font-medium mb-2 italic">{massage.objective}</p>
        )}
        {massage.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{massage.description}</p>
        )}

        {!compact && massage.benefits && (
          <div className="mb-4">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-[#3D2C4E] font-medium hover:text-[#FBB8D9] transition-colors">
              Benefícios {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-gray-500 leading-relaxed bg-[#faf4ff] rounded-lg p-3">{massage.benefits}</p>
            )}
          </div>
        )}

        {massage.available && onSchedule && (
          <button
            onClick={() => onSchedule(massage)}
            className="w-full flex items-center justify-center gap-2 btn-primary mt-2"
          >
            Agendar <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
