"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ALL_MODELS, ALL_TYPE, BRANDS, TYPES, brandsForType, modelsFor, tileStyle, typeById, yearsLabel, type MotoModel, type MotoTypeId } from "@/lib/moto";
import { plural } from "@/lib/catalog";
import { useGarage } from "./garage-provider";
import { MotoIcon, SearchIcon } from "./icons";

type Step = "brand" | "model" | "year";
const NOW = new Date().getFullYear();
const norm = (s: string) => s.toLowerCase().replace(/[\s-]/g, "");

function ModelButton({ m, brandName, on, onClick }: { m: MotoModel; brandName?: string; on?: boolean; onClick: () => void }) {
  const t = typeById(m.type)!;
  return (
    <button onClick={onClick} className={`tap flex w-full items-center gap-3 rounded-[14px] border-2 px-3 py-2.5 text-left ${on ? "border-pri bg-pri-soft" : "border-line bg-card hover:border-line2"}`}>
      <span className="flex h-10 w-[54px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: t.soft }}>
        <MotoIcon type={m.type} color={t.fg} width={44} strokeWidth={2.8} />
      </span>
      <span className="min-w-0 flex-1">
        {brandName && <span className="kick block">{brandName}</span>}
        <span className="disp block text-[23px] leading-[1.05]">{m.name}</span>
        <span className="mt-0.5 block text-[12.5px] text-mut">
          {m.cc} cm³ · {yearsLabel(m)}
        </span>
      </span>
      <span className="rounded-md px-2 py-1 text-[11.5px] font-bold" style={{ background: t.soft, color: t.ink }}>
        {m.type}
      </span>
    </button>
  );
}

export function GaragePicker() {
  const router = useRouter();
  const { addBike } = useGarage();
  const [type, setType] = useState<MotoTypeId | "all">("all");
  const [step, setStep] = useState<Step>("brand");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const brand = BRANDS.find((b) => b.id === brandId) ?? null;
  const model = brand?.models.find((m) => m.id === modelId) ?? null;
  const brands = brandsForType(type);
  const query = norm(q.trim());
  const found = query ? ALL_MODELS.filter((m) => (type === "all" || m.type === type) && norm(m.brandName + m.name).includes(query)) : [];
  const years: number[] = [];
  if (model) for (let y = model.to ?? NOW; y >= model.from && years.length < 12; y--) years.push(y);

  const pickType = (id: MotoTypeId | "all") => {
    setType(id);
    const keepB = brand?.models.some((m) => id === "all" || m.type === id);
    const keepM = keepB && model && (id === "all" || model.type === id);
    if (!keepB) {
      setBrandId(null);
      setStep("brand");
    }
    if (!keepM) {
      setModelId(null);
      setYear(null);
      if (keepB) setStep("model");
    }
  };

  const confirm = () => {
    if (!model || !year || !brand) return;
    addBike({ modelId: model.id, year });
    router.push(`/catalogue?type=${encodeURIComponent(model.type)}&brand=${brand.id}&model=${model.id}`);
  };

  const steps: { id: Step; num: string; value: string | null; enabled: boolean }[] = [
    { id: "brand", num: "1 · MARQUE", value: brand?.name ?? null, enabled: true },
    { id: "model", num: "2 · MODÈLE", value: model?.name ?? null, enabled: !!brand },
    { id: "year", num: "3 · ANNÉE", value: year ? String(year) : null, enabled: !!model },
  ];
  const t = type === "all" ? null : typeById(type)!;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col pb-32 md:pb-10">
      <label className="flex h-12 items-center gap-2.5 rounded-[14px] border-[1.5px] border-line bg-card px-3 transition-[border-color,box-shadow] focus-within:border-pri focus-within:shadow-[0_0_0_3px_rgb(214_63_11/0.18)]">
        <SearchIcon size={18} className="text-mut" />
        <span className="sr-only">Rechercher un modèle</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Z1000, GTS 300, MT-07, TMAX…" className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-mut" />
      </label>

      <div role="group" aria-label="Type de moto" className="noscroll -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5 md:mx-0 md:grid md:grid-cols-7 md:px-0">
        {[ALL_TYPE, ...TYPES].map((x) => {
          const on = x.id === type;
          return (
            <button key={x.id} onClick={() => pickType(x.id)} aria-pressed={on} className="flex h-[74px] w-[78px] shrink-0 flex-col items-center justify-center gap-[3px] rounded-[14px] border-2 transition-[background-color,border-color,transform] duration-200 hover:border-[var(--tone)] active:scale-95 md:w-auto" style={{ ...tileStyle(x, on), "--tone": x.fg } as React.CSSProperties}>
              <MotoIcon type={x.id} color={x.fg} width={50} strokeWidth={2.8} />
              <span className="text-xs font-bold whitespace-nowrap">{x.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {steps.map((s) => {
          const cls = step === s.id ? "border-pri bg-pri-soft" : s.value ? "border-line bg-card" : "border-line bg-sunk opacity-75";
          return (
            <button key={s.id} disabled={!s.enabled} onClick={() => { setStep(s.id); setQ(""); }} className={`tap flex h-[46px] min-w-0 flex-col justify-center rounded-xl border-[1.5px] px-2.5 text-left ${cls}`}>
              <span className="text-[10px] font-bold tracking-[1px] text-mut">{s.num}</span>
              <span className="w-full truncate text-[13px] font-bold">{s.value ?? "Choisir"}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {query ? (
          <div key="search" className="enter">
            <div className="kick mb-2">{plural(found.length, "modèle trouvé", "modèles trouvés")}</div>
            <div className="flex flex-col gap-2">
              {found.map((m) => (
                <ModelButton key={m.id} m={m} brandName={m.brandName} onClick={() => { setBrandId(m.brand); setModelId(m.id); setYear(null); setStep("year"); setQ(""); }} />
              ))}
              {!found.length && <p className="rounded-[14px] border-[1.5px] border-dashed border-line2 p-5 text-center text-[13.5px] text-mut">Aucun modèle trouvé. Essayez « Tous » ou une autre orthographe.</p>}
            </div>
          </div>
        ) : step === "brand" ? (
          <div key={`brand-${type}`} className="enter">
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="disp text-[21px]">Marque</span>
              <span className="text-[12.5px] font-semibold" style={{ color: t?.ink ?? "var(--color-mut)" }}>
                {plural(brands.length, "marque", "marques")}
                {t ? ` en ${t.label}` : ""}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {brands.map((b) => {
                const on = b.id === brandId;
                return (
                  <button key={b.id} onClick={() => { setBrandId(b.id); setModelId(null); setYear(null); setStep("model"); }} aria-pressed={on} className={`tap flex h-[88px] flex-col items-center justify-center gap-[3px] rounded-[14px] border-2 px-1.5 ${on ? "border-pri bg-pri-soft" : "border-line bg-card hover:border-line2"}`}>
                    <span className="disp flex size-9 items-center justify-center rounded-full bg-sunk text-[17px]">{b.ini}</span>
                    <span className="text-[13px] font-bold whitespace-nowrap">{b.short}</span>
                    <span className="text-[11.5px] text-mut">{plural(modelsFor(b, type).length, "modèle", "modèles")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : step === "model" && brand ? (
          <div key={`model-${brand.id}-${type}`} className="enter">
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="disp text-[21px]">{brand.name}</span>
              <span className="text-[12.5px] text-mut">{plural(modelsFor(brand, type).length, "modèle", "modèles")}</span>
            </div>
            <div className="flex flex-col gap-2">
              {modelsFor(brand, type).map((m) => (
                <ModelButton key={m.id} m={m} on={m.id === modelId} onClick={() => { setModelId(m.id); setYear(null); setStep("year"); }} />
              ))}
            </div>
          </div>
        ) : model && brand ? (
          <div key={`year-${model.id}`} className="enter">
            <div className="mb-3.5 flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
              <span className="flex h-[54px] w-[72px] shrink-0 items-center justify-center rounded-xl" style={{ background: typeById(model.type)!.soft }}>
                <MotoIcon type={model.type} color={typeById(model.type)!.fg} width={60} />
              </span>
              <span>
                <span className="kick block">{brand.name}</span>
                <span className="disp block text-[28px]">{model.name}</span>
                <span className="mt-0.5 block text-[12.5px] text-mut">
                  {model.cc} cm³ · {model.type} · {yearsLabel(model)}
                </span>
              </span>
            </div>
            <div className="kick mb-2">Année de mise en circulation</div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {years.map((y) => (
                <button key={y} onClick={() => setYear(y)} aria-pressed={y === year} className={`tap h-12 rounded-xl border-[1.5px] font-mono text-[15px] ${y === year ? "border-pri bg-pri text-white" : "border-line bg-card hover:border-line2"}`}>
                  {y}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-[84px] z-20 border-t border-line bg-card px-4 pt-3 pb-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
        {model && year ? (
          <button onClick={confirm} className="tap enter flex h-14 w-full items-center justify-between rounded-[14px] bg-pri px-[18px] text-[15px] font-bold text-white hover:bg-pri-h">
            <span>Enregistrer et voir les pièces</span>
            <span className="disp text-lg">
              {model.name} · {year}
            </span>
          </button>
        ) : (
          <button disabled className="h-14 w-full rounded-[14px] border-[1.5px] border-dashed border-line2 bg-page text-[15px] font-semibold text-mut">
            {!brand ? "Choisissez la marque" : !model ? "Choisissez le modèle" : "Choisissez l’année"}
          </button>
        )}
      </div>
    </div>
  );
}
