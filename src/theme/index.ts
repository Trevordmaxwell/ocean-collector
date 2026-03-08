export const palette = {
  sand: "#FDF5E4",
  foam: "#D7F1EE",
  tide: "#8FC9E8",
  lagoon: "#5FA5C9",
  deep: "#22536D",
  shellPink: "#F7CFD6",
  peach: "#F4BE98",
  coral: "#E78573",
  pearl: "#FFFDF8",
  kelp: "#5D7C66",
  driftwood: "#B6855C",
  sunshine: "#FFD87A",
  ink: "#23414F",
  mist: "#64808D",
  success: "#61AF86",
  border: "rgba(35, 65, 79, 0.08)",
  shadow: "rgba(35, 65, 79, 0.14)",
} as const;

export const gradients = {
  app: ["#FFF8E9", "#DDF3EF", "#C8E7F8"],
  hero: ["#F7D7D9", "#FCEAC2", "#CFEAF5"],
  ocean: ["#BFE5F5", "#D5F0E8", "#FFF2CB"],
  shell: ["#F6D3C1", "#FAEFE7"],
  tooth: ["#CDE9F7", "#EEF7FE"],
  seaGlass: ["#BEE8DA", "#E5FFF8"],
  cleanup: ["#FFE8B8", "#F8D4C0"],
  reward: ["#FFE7A8", "#F8CDD3"],
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const typography = {
  heading: "Fredoka_700Bold",
  headingSoft: "Fredoka_600SemiBold",
  body: "Nunito_400Regular",
  bodyMedium: "Nunito_500Medium",
  bodyBold: "Nunito_700Bold",
} as const;

export const shadows = {
  card: {
    shadowColor: palette.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  soft: {
    shadowColor: palette.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;
