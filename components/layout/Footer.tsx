import { MessageCircle } from "lucide-react";

interface Config {
  whatsapp?: string;
  teamMembers?: string;
}

export default function Footer({ config }: { config?: Config }) {
  const wa = config?.whatsapp?.replace(/\D/g, "") || "";

  // teamMembers é uma string separada por vírgulas: "Ana, Beatriz, Carla"
  const members = config?.teamMembers
    ? config.teamMembers.split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  return (
    <footer className="bg-[#3D2C4E] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Esquerda — equipe */}
          <div className="text-sm text-purple-200">
            {members.length > 0 ? (
              <span>
                <span className="text-[#E6CBF7] font-medium">Equipe: </span>
                {members.join(" · ")}
              </span>
            ) : (
              <span className="text-purple-400 text-xs italic">Configure os nomes da equipe no painel admin.</span>
            )}
          </div>

          {/* Direita — WhatsApp */}
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-green-500 transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
