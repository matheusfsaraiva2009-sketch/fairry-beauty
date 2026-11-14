"use client";
import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagem" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">(value && value.startsWith("http") ? "url" : "upload");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao enviar."); return; }
      onChange(data.url);
    } catch { setError("Erro de conexão."); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fakeEvt = { target: { files: [file] } } as any;
    handleFile(fakeEvt);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#3D2C4E] mb-1.5">{label}</label>

      {/* Tabs */}
      <div className="flex gap-1 mb-2 p-1 bg-[#faf4ff] rounded-xl w-fit">
        <button type="button" onClick={() => setTab("upload")}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === "upload" ? "bg-white text-[#3D2C4E] shadow-sm" : "text-gray-500 hover:text-[#3D2C4E]"}`}>
          📁 Do dispositivo
        </button>
        <button type="button" onClick={() => setTab("url")}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === "url" ? "bg-white text-[#3D2C4E] shadow-sm" : "text-gray-500 hover:text-[#3D2C4E]"}`}>
          🔗 Por URL
        </button>
      </div>

      {tab === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors
            ${uploading ? "border-[#E6CBF7] bg-[#faf4ff]" : "border-[#E6CBF7] hover:border-[#FBB8D9] hover:bg-[#fff8ff]"}`}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-[#3D2C4E]">
              <Loader2 size={24} className="animate-spin text-[#FBB8D9]" />
              <span className="text-xs">Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload size={22} className="text-[#E6CBF7]" />
              <span className="text-xs">Clique ou arraste a imagem aqui</span>
              <span className="text-[10px] text-gray-300">JPG, PNG, WEBP, GIF • máx. 5MB</span>
            </div>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300"
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-[#f0e8ff] shadow-sm" />
          <button type="button" onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
