"use client";
import { useEffect, useState } from "react";
import { Save, ExternalLink, CheckCircle } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

function Section({ title, children, onSave, saving, saved }: any) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0e8ff] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-base font-semibold text-[#3D2C4E]">{title}</h2>
        {saved && <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={13} /> Salvo!</span>}
      </div>
      {children}
      <button onClick={onSave} disabled={saving} className="mt-5 btn-primary disabled:opacity-60">
        <Save size={15} /> {saving ? "Salvando..." : "Salvar secção"}
      </button>
    </div>
  );
}

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config").then(r => r.json()).then(d => { setConfig(d); setLoaded(true); });
  }, []);

  const setVal = (k: string, v: string) => setConfig(c => ({ ...c, [k]: v }));

  const save = async (keys: string[], section: string) => {
    setSaving(s => ({ ...s, [section]: true }));
    const data: Record<string, string> = {};
    keys.forEach(k => data[k] = config[k] || "");
    await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(s => ({ ...s, [section]: false }));
    setSaved(s => ({ ...s, [section]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 2500);
  };

  if (!loaded) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;

  const Field = ({ label, k, type = "text", placeholder, hint }: any) => (
    <div>
      <label className="block text-sm font-medium text-[#3D2C4E] mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea value={config[k] || ""} onChange={e => setVal(k, e.target.value)} placeholder={placeholder} rows={4}
          className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] resize-none placeholder:text-gray-300" />
      ) : (
        <input type={type} value={config[k] || ""} onChange={e => setVal(k, e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-[#E6CBF7] rounded-xl text-sm text-[#3D2C4E] placeholder:text-gray-300" />
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-[#3D2C4E]">Configurações</h1>

      <Section title="🌸 Identidade da Marca" onSave={() => save(["brandName","tagline","logoUrl"], "brand")} saving={saving.brand} saved={saved.brand}>
        <div className="space-y-4">
          <Field label="Nome da Marca" k="brandName" placeholder="Ex: Aura & Essência" />
          <Field label="Tagline / Slogan" k="tagline" placeholder="Ex: Cuidado que transforma" />
          <ImageUpload label="Logo (upload ou URL)" value={config.logoUrl || ""} onChange={url => setVal("logoUrl", url)} />
          {config.logoUrl && <img src={config.logoUrl} alt="Logo preview" className="h-16 object-contain rounded-lg border border-[#f0e8ff]" />}
        </div>
      </Section>

      <Section title="🏠 Página Inicial" onSave={() => save(["heroTitle","heroSubtitle","heroImage"], "hero")} saving={saving.hero} saved={saved.hero}>
        <div className="space-y-4">
          <Field label="Título principal (Hero)" k="heroTitle" placeholder="Ex: Harmonia e Bem-Estar..." />
          <Field label="Subtítulo (Hero)" k="heroSubtitle" placeholder="Frase complementar" />
          <ImageUpload label="Imagem do Hero (upload ou URL)" value={config.heroImage || ""} onChange={url => setVal("heroImage", url)} />
        </div>
      </Section>

      <Section title="📖 Textos Institucionais" onSave={() => save(["aboutText","objectiveText"], "about")} saving={saving.about} saved={saved.about}>
        <div className="space-y-4">
          <Field label="Texto Sobre Nós" k="aboutText" type="textarea" placeholder="Conte a história da sua marca..." />
          <Field label="Texto do Objetivo" k="objectiveText" type="textarea" placeholder="Qual é o objetivo e proposta da sua marca?" />
        </div>
      </Section>

      <Section title="💬 WhatsApp" onSave={() => save(["whatsapp"], "whatsapp")} saving={saving.whatsapp} saved={saved.whatsapp}>
        <div className="space-y-4">
          <Field label="Número do WhatsApp" k="whatsapp" placeholder="5511999999999" hint="Somente números. Ex: 5511999999999 (DDI+DDD+número)" />
          {config.whatsapp && (
            <a href={`https://wa.me/${config.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline">
              <ExternalLink size={14} /> Testar número
            </a>
          )}
        </div>
      </Section>

      <Section title="📱 Contato e Redes Sociais" onSave={() => save(["email","instagram","facebook"], "social")} saving={saving.social} saved={saved.social}>
        <div className="space-y-4">
          <Field label="Email de contato" k="email" type="email" placeholder="contato@suamarca.com" />
          <Field label="Instagram (URL completa)" k="instagram" placeholder="https://instagram.com/suamarca" />
          <Field label="Facebook (URL completa)" k="facebook" placeholder="https://facebook.com/suamarca" />
        </div>
      </Section>

      <Section title="👥 Equipe (Rodapé)" onSave={() => save(["teamMembers"], "team")} saving={saving.team} saved={saved.team}>
        <div className="space-y-4">
          <Field
            label="Nomes da Equipe"
            k="teamMembers"
            placeholder="Ana, Beatriz, Carla"
            hint="Separe os nomes por vírgula. Ex: Ana, Beatriz, Carla. Eles aparecem no rodapé do site."
          />
          {config.teamMembers && (
            <p className="text-xs text-purple-500 bg-purple-50 rounded-lg px-3 py-2">
              Prévia: <span className="font-medium">{config.teamMembers.split(",").map((m: string) => m.trim()).filter(Boolean).join(" · ")}</span>
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
