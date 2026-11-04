import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  BRANDS,
  MAKER_BRANDS,
  enginesFor,
  modelsForBrand,
  yearsFor,
} from "../data/catalog";
import type { Category, SearchFilters } from "../types";
import { colors, radii, space, typography } from "../theme";
import { Chip, PressScale } from "./ui";

export function FilterPanel({
  filters,
  onChange,
  categories,
  compact,
}: {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  categories: Category[];
  compact?: boolean;
}) {
  const [brandQ, setBrandQ] = useState("");
  const [makerQ, setMakerQ] = useState("");
  const [advanced, setAdvanced] = useState(false);

  const set = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  const models = modelsForBrand(filters.brand);
  const years = yearsFor(filters.brand, filters.model).slice(0, 16);
  const engines = enginesFor(filters.brand, filters.model);
  const activeCat = categories.find((c) => c.id === filters.categoryId);

  const vehicleBrands = useMemo(
    () =>
      BRANDS.filter((b) =>
        b.toLowerCase().includes(brandQ.trim().toLowerCase()),
      ),
    [brandQ],
  );
  const makers = useMemo(
    () =>
      MAKER_BRANDS.filter((b) =>
        b.toLowerCase().includes(makerQ.trim().toLowerCase()),
      ),
    [makerQ],
  );

  const brakeFilters = activeCat?.slug === "freinage";
  const filterFilters = activeCat?.slug === "filtres";

  return (
    <ScrollView contentContainerStyle={[styles.body, compact && { padding: 0 }]}>
      <Text style={styles.group}>Véhicule</Text>
      <Text style={styles.field}>Marque</Text>
      <TextInput
        value={brandQ}
        onChangeText={setBrandQ}
        placeholder="Rechercher une marque…"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />
      <View style={styles.wrap}>
        <Chip
          label="Toutes"
          selected={!filters.brand || filters.brand === "all"}
          onPress={() =>
            set({ brand: "all", model: "all", year: undefined, engine: undefined })
          }
        />
        {vehicleBrands.map((b) => (
          <Chip
            key={b}
            label={b}
            selected={filters.brand === b}
            onPress={() =>
              set({ brand: b, model: "all", year: undefined, engine: undefined })
            }
          />
        ))}
      </View>

      {filters.brand && filters.brand !== "all" ? (
        <>
          <Text style={styles.field}>Modèle {filters.brand}</Text>
          <View style={styles.wrap}>
            <Chip
              label="Tous"
              selected={!filters.model || filters.model === "all"}
              onPress={() => set({ model: "all", year: undefined, engine: undefined })}
            />
            {models.map((m) => (
              <Chip
                key={m}
                label={m}
                selected={filters.model === m}
                onPress={() => set({ model: m, year: undefined, engine: undefined })}
              />
            ))}
          </View>
        </>
      ) : null}

      {filters.model && filters.model !== "all" ? (
        <>
          <Text style={styles.field}>Année</Text>
          <View style={styles.wrap}>
            <Chip
              label="Toutes"
              selected={!filters.year || filters.year === "all"}
              onPress={() => set({ year: undefined })}
            />
            {years.map((y) => (
              <Chip
                key={y}
                label={String(y)}
                selected={Number(filters.year) === y}
                onPress={() => set({ year: y })}
              />
            ))}
          </View>
          {engines.length > 0 ? (
            <>
              <Text style={styles.field}>Moteur</Text>
              <View style={styles.wrap}>
                <Chip
                  label="Tous"
                  selected={!filters.engine || filters.engine === "all"}
                  onPress={() => set({ engine: undefined })}
                />
                {engines.map((e) => (
                  <Chip
                    key={e}
                    label={e}
                    selected={filters.engine === e}
                    onPress={() => set({ engine: e })}
                  />
                ))}
              </View>
            </>
          ) : null}
        </>
      ) : null}

      <Text style={styles.group}>Pièce</Text>
      <Text style={styles.field}>Catégorie</Text>
      <View style={styles.wrap}>
        <Chip
          label="Toutes"
          selected={!filters.categoryId || filters.categoryId === "all"}
          onPress={() => set({ categoryId: "all", subCategoryId: "all" })}
        />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            selected={filters.categoryId === c.id}
            onPress={() => set({ categoryId: c.id, subCategoryId: "all" })}
          />
        ))}
      </View>

      {activeCat && activeCat.subCategories.length > 0 ? (
        <>
          <Text style={styles.field}>Sous-catégorie · {activeCat.name}</Text>
          <View style={styles.wrap}>
            <Chip
              label="Toutes"
              selected={!filters.subCategoryId || filters.subCategoryId === "all"}
              onPress={() => set({ subCategoryId: "all" })}
            />
            {activeCat.subCategories.map((s) => (
              <Chip
                key={s.id}
                label={s.name}
                selected={filters.subCategoryId === s.id}
                onPress={() => set({ subCategoryId: s.id })}
              />
            ))}
          </View>
        </>
      ) : null}

      {brakeFilters ? (
        <>
          <Text style={styles.field}>Filtres freinage</Text>
          <View style={styles.wrap}>
            {["Avant", "Arrière"].map((pos) => (
              <Chip
                key={pos}
                label={pos}
                selected={filters.position === pos}
                onPress={() =>
                  set({ position: filters.position === pos ? undefined : pos })
                }
              />
            ))}
          </View>
        </>
      ) : null}

      {filterFilters ? (
        <Text style={styles.hint}>
          Type de filtre, diamètre et hauteur sont visibles sur la fiche pièce.
        </Text>
      ) : null}

      <Text style={styles.field}>Marque fabricant</Text>
      <TextInput
        value={makerQ}
        onChangeText={setMakerQ}
        placeholder="Bosch, Valeo, NGK…"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />
      <View style={styles.wrap}>
        <Chip
          label="Toutes"
          selected={!filters.makerBrand || filters.makerBrand === "all"}
          onPress={() => set({ makerBrand: "all" })}
        />
        {makers.map((m) => (
          <Chip
            key={m}
            label={m}
            selected={filters.makerBrand === m}
            onPress={() => set({ makerBrand: m })}
          />
        ))}
      </View>

      <Text style={styles.group}>Disponibilité</Text>
      <View style={styles.wrap}>
        {[
          { id: "all", label: "Toutes" },
          { id: "in_stock", label: "En stock" },
          { id: "low_stock", label: "Stock limité" },
          { id: "out_of_stock", label: "Rupture" },
        ].map((s) => (
          <Chip
            key={s.id}
            label={s.label}
            selected={(filters.stock ?? "all") === s.id}
            onPress={() => set({ stock: s.id })}
          />
        ))}
      </View>

      <Text style={styles.group}>Prix (TND)</Text>
      <View style={styles.wrap}>
        {[
          { min: undefined, max: undefined, label: "Tous" },
          { min: 0, max: 50, label: "≤ 50" },
          { min: 50, max: 100, label: "50–100" },
          { min: 100, max: 200, label: "100–200" },
          { min: 200, max: undefined, label: "≥ 200" },
        ].map((p) => {
          const on =
            filters.priceMin === p.min && filters.priceMax === p.max;
          return (
            <Chip
              key={p.label}
              label={p.label}
              selected={on}
              onPress={() => set({ priceMin: p.min, priceMax: p.max })}
            />
          );
        })}
      </View>

      <PressScale onPress={() => setAdvanced((v) => !v)} style={styles.advToggle}>
        <Text style={styles.advTxt}>
          {advanced ? "Masquer les filtres avancés" : "Filtres avancés"}
        </Text>
      </PressScale>

      {advanced ? (
        <>
          <Text style={styles.field}>État</Text>
          <View style={styles.wrap}>
            {[
              { id: "all", label: "Tous" },
              { id: "original", label: "Origine" },
              { id: "oem", label: "OEM" },
              { id: "aftermarket", label: "Adaptable" },
              { id: "used", label: "Occasion" },
            ].map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                selected={(filters.condition ?? "all") === c.id}
                onPress={() => set({ condition: c.id })}
              />
            ))}
          </View>
          <Text style={styles.field}>Réf. OEM</Text>
          <TextInput
            value={filters.query ?? ""}
            onChangeText={(query) => set({ query })}
            placeholder="04465-0K240"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
          />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 24 },
  group: {
    ...typography.section,
    marginTop: space.md,
    marginBottom: 8,
  },
  field: { ...typography.label, marginBottom: 6, marginTop: 8 },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
    color: colors.text,
    marginBottom: 8,
    fontSize: 15,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap" },
  hint: { ...typography.caption, marginBottom: 8 },
  advToggle: { marginTop: 16, paddingVertical: 8 },
  advTxt: { color: colors.primary, fontWeight: "700", fontSize: 14 },
});
