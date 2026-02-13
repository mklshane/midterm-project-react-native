export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryText: string;
  accent: string;
  ctaPeach: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#FAFAF9",
    surface: "#E7E5E4",
    card: "#FFFFFF",
    text: "#111827",
    mutedText: "#6B7280",
    primary: "#F5D0C5",
    primaryText: "#111827",
    accent: "#0F766E",
    ctaPeach: "#f4c3b4",
    border: "#E7E5E4",
    success: "#22C55E",
    warning: "#F97316",
    error: "#EF4444",
  },
  dark: {
    background: "#181818",
    surface: "#212121",
    card: "#2f2f2f",
    text: "#E2E8F0",
    mutedText: "#9ca6b3",
    primary: "#38BDF8",
    primaryText: "#0B1120",
    accent: "#FBBF24",
    ctaPeach: "#F5D0C5",
    border: "#464646",
    success: "#22C55E",
    warning: "#FB923C",
    error: "#F87171",
  },
};

export const getColorsFor = (mode: ThemeMode) => themeColors[mode];
