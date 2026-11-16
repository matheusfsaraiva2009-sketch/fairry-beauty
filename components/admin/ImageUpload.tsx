"use client";
import { useRef, useState } from "react";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const MAX_MB = 8;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function ImageUpload({ value, onChange, label = "Imagem" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">(
    value && value.startsWith("http") ? "url" : "upload"
  );
  const [urlInput, setUrlInput] = useState(value && value.startsWith("http") ? value : "");

  const processFile = (file: File) => {
    setError("");

    if (!ALLOWED.includes(file.type)) {
      setError("Use JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Máximo ${MAX_MB}MB por imagem.`);
      return;
    }

    setLoading(true);

    // Reduz o tamanho da imagem antes de converter para base64
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_DIM = 1200;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
        else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL("image/jpeg", 0.82);
      URL.revokeObjectURL(objectUrl);
      onChange(base64);
      setLoading(false);
    };
    img.onerror = () => {
      setError("Erro ao processar imagem.");
      setLoading(false);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleUrlConfirm = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
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
          🔗 Por link
        </button>
      </div>

      {tab === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !loading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
            ${loading
              ? "border-[#E6CBF7] bg-[#faf4ff] cursor-wait"
              : "border-[#E6CBF7] hover:border-[#FBB8D9] hover:bg-[#fff8ff] cursor-pointer"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleFile}
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-[#3D2C4E]">
              <Loader2 size={26} className="animate-spin text-[#FBB8D9]" />
              <span className="text-xs">Processando imagem...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload size={26} className="text-[#E6CBF7]" />
              <p className="text-xs font-medium text-[#3D2C4E]">Clique ou arraste a imagem aqui</p>
              <p className="text-[10px] text-gray-400">JPG, PNG, WEBP • até {MAX_MB}MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlConfirm()}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-1 px-3 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E6CBF7]"
          />
          <button
            type="button"
            onClick={handleUrlConfirm}
            className="px-3 py-2.5 bg-[#E6CBF7] text-[#3D2C4E] rounded-xl text-sm font-medium hover:bg-[#FBB8D9] transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="mt-3 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-28 w-28 object-cover rounded-xl border border-[#f0e8ff] shadow-sm"
          />
          <button
            type="button"
            onClick={() => { onChange(""); setUrlInput(""); setError(""); }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
