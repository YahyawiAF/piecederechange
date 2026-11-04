"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { modelById, typeById, type ModelWithBrand, type MotoType } from "@/lib/moto";

/** A bike saved in "Mon garage". Kept in the browser for now; can move to the customer account later. */
export type SavedBike = { modelId: string; year: number };

type GarageBike = SavedBike & { model: ModelWithBrand; type: MotoType; label: string };

type GarageCtx = {
  bikes: GarageBike[];
  active: GarageBike;
  setActive: (modelId: string) => void;
  addBike: (bike: SavedBike) => void;
};

const STORAGE_KEY = "pe-garage-v1";
const DEFAULT: { bikes: SavedBike[]; active: string } = {
  bikes: [
    { modelId: "z1000", year: 2016 },
    { modelId: "gts", year: 2021 },
  ],
  active: "z1000",
};

const Ctx = createContext<GarageCtx | null>(null);

function expand(b: SavedBike): GarageBike | null {
  const model = modelById(b.modelId);
  const type = model && typeById(model.type);
  if (!model || !type) return null;
  return { ...b, model, type, label: `${model.brandName} ${model.name}` };
}

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(DEFAULT);

  // Load the saved garage after hydration so server and client HTML match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* storage unavailable: keep defaults */
    }
  }, []);

  const save = useCallback((next: typeof DEFAULT) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<GarageCtx>(() => {
    const bikes = state.bikes.map(expand).filter((b): b is GarageBike => !!b);
    const list = bikes.length ? bikes : DEFAULT.bikes.map(expand).filter((b): b is GarageBike => !!b);
    const active = list.find((b) => b.modelId === state.active) ?? list[0];
    return {
      bikes: list,
      active,
      setActive: (modelId) => save({ ...state, active: modelId }),
      addBike: (bike) =>
        save({
          bikes: [bike, ...state.bikes.filter((b) => b.modelId !== bike.modelId)].slice(0, 5),
          active: bike.modelId,
        }),
    };
  }, [state, save]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGarage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGarage must be used inside <GarageProvider>");
  return ctx;
}

/** Query string that scopes the catalogue to one model. */
export const bikeQuery = (b: { model: ModelWithBrand }) => `type=${encodeURIComponent(b.model.type)}&brand=${b.model.brand}&model=${b.model.id}`;
