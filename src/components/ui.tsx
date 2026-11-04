import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors, fontSize, radii, space, touch, typography } from "../theme";

type BtnVariant = "primary" | "accent" | "success" | "outline" | "ghost";

export function PressScale({
  children,
  style,
  onPress,
  disabled,
  hitSlop,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  hitSlop?: PressableProps["hitSlop"];
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      hitSlop={hitSlop}
      onPressIn={() =>
        Animated.timing(scale, {
          toValue: 0.97,
          duration: 100,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start()
      }
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
  textStyle,
}: {
  label: string;
  onPress?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "accent"
        ? colors.accent
        : variant === "success"
          ? colors.success
          : "transparent";

  return (
    <PressScale
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnText,
          {
            color:
              variant === "outline" || variant === "ghost"
                ? colors.primary
                : colors.secondary,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </PressScale>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  count,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
}) {
  return (
    <PressScale onPress={onPress}>
      <View style={[styles.chip, selected && styles.chipOn]}>
        <Text style={[styles.chipText, selected && styles.chipTextOn]}>
          {label}
        </Text>
        {count != null ? (
          <View style={[styles.chipCount, selected && styles.chipCountOn]}>
            <Text
              style={[styles.chipCountTxt, selected && styles.chipCountTxtOn]}
            >
              {count}
            </Text>
          </View>
        ) : null}
      </View>
    </PressScale>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <PressScale onPress={onAction}>
          <Text style={typography.seeAll}>{actionLabel}</Text>
        </PressScale>
      ) : null}
    </View>
  );
}

type BadgeVariant =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "count"
  | "condition";

export function Badge({
  label,
  variant = "neutral",
  backgroundColor,
  color,
}: {
  label: string;
  variant?: BadgeVariant;
  backgroundColor?: string;
  color?: string;
}) {
  const palette: Record<BadgeVariant, { bg: string; fg: string }> = {
    neutral: { bg: colors.surface, fg: colors.textMuted },
    primary: { bg: colors.primarySoft, fg: colors.primary },
    accent: { bg: colors.accent, fg: colors.white },
    success: { bg: colors.successMuted, fg: colors.successDark },
    warning: { bg: colors.warningMuted, fg: colors.warningDark },
    count: { bg: colors.successMuted, fg: colors.successDark },
    condition: { bg: colors.primary, fg: colors.white },
  };
  const tone = palette[variant];
  return (
    <View
      style={[styles.badge, { backgroundColor: backgroundColor ?? tone.bg }]}
    >
      <Text style={[styles.badgeTxt, { color: color ?? tone.fg }]}>
        {label}
      </Text>
    </View>
  );
}

export function IconCircle({
  children,
  size = 40,
  backgroundColor,
}: {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
}) {
  return (
    <View
      style={[
        styles.iconCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor ?? colors.surface,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: touch.min,
    borderRadius: radii.btn,
    paddingHorizontal: space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  chipTextOn: { color: colors.secondary },
  chipCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipCountOn: { backgroundColor: "rgba(255,255,255,0.22)" },
  chipCountTxt: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  chipCountTxtOn: { color: colors.white },
  sectionHead: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.section,
    flex: 1,
    paddingRight: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeTxt: { fontSize: 12, fontWeight: "700" },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
});
