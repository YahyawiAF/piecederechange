import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  BRAND_STYLES,
  CATEGORY_THUMBS,
  VEHICLE_PHOTOS,
  colors,
  radii,
} from "../theme";
import { PressScale } from "./ui";

export function VehicleTypeTile({
  id,
  label,
  isActive,
  onPress,
}: {
  id: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const photo = VEHICLE_PHOTOS[id];
  return (
    <PressScale
      onPress={onPress}
      style={[styles.vWrap, isActive && styles.active]}
    >
      <View style={styles.vImg}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.fill} />
        ) : (
          <View style={[styles.fill, { backgroundColor: "#ddd" }]} />
        )}
        <View style={styles.grad} />
        <Text style={styles.vLabel}>{label}</Text>
      </View>
    </PressScale>
  );
}

export function BrandTile({
  brand,
  isActive,
  onPress,
}: {
  brand: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const style = BRAND_STYLES[brand] ?? {
    bg: colors.primary,
    text: "#fff",
    letter: brand[0],
  };
  return (
    <PressScale
      onPress={onPress}
      style={[
        styles.brand,
        { backgroundColor: style.bg },
        isActive && styles.active,
      ]}
    >
      <Text style={[styles.letter, { color: style.text }]}>{style.letter}</Text>
      <Text style={[styles.brandName, { color: style.text }]}>{brand}</Text>
    </PressScale>
  );
}

export function CategoryTile({
  slug,
  name,
  isActive,
  onPress,
  size = "small",
}: {
  slug: string;
  name: string;
  isActive: boolean;
  onPress: () => void;
  size?: "large" | "small";
}) {
  const w = size === "large" ? 96 : 78;
  const thumb = CATEGORY_THUMBS[slug];
  return (
    <PressScale
      onPress={onPress}
      style={[styles.cat, { width: w, height: w }, isActive && styles.active]}
    >
      {thumb ? (
        <Image source={{ uri: thumb }} style={styles.fill} />
      ) : (
        <View style={[styles.fill, { backgroundColor: "#ccc" }]} />
      )}
      <View style={styles.grad} />
      <Text
        style={[styles.catName, size === "large" && { fontSize: 12 }]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </PressScale>
  );
}

export function SubCategoryTile({
  name,
  isActive,
  onPress,
}: {
  name: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      style={[styles.sub, isActive && styles.subOn]}
    >
      <View style={[styles.subIcon, isActive && { backgroundColor: "rgba(255,255,255,0.25)" }]}>
        <Text style={{ fontSize: 16 }}>{isActive ? "✦" : "⬤"}</Text>
      </View>
      <Text
        style={[styles.subName, isActive && { color: "#fff" }]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  vWrap: {
    width: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
    marginRight: 8,
  },
  vImg: { width: "100%", aspectRatio: 1 },
  fill: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  grad: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  vLabel: {
    position: "absolute",
    bottom: 6,
    left: 0,
    right: 0,
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
  },
  active: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  brand: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  letter: { fontSize: 22, fontWeight: "800" },
  brandName: { fontSize: 8, fontWeight: "800", textTransform: "uppercase" },
  cat: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
    marginRight: 8,
    justifyContent: "flex-end",
  },
  catName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
    padding: 6,
    zIndex: 1,
  },
  sub: {
    width: 88,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: "#fff",
    padding: 8,
    alignItems: "center",
    marginRight: 8,
    gap: 6,
  },
  subOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  subIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
  },
  subName: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    color: colors.text,
  },
});
