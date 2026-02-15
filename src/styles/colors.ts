export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  divider: string;
  shadow: string;
  highlight: string;
  gradientStart: string;
  gradientEnd: string;
  saveIcon: string; 
};

export const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#FAFAFA",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#09090B", 
    mutedText: "#71717A",
    primary: "#18181B", 
    primaryLight: "#F4F4F5",
    secondary: "#27272A",
    accent: "#3B82F6", 
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: "#E4E4E7",
    divider: "#F4F4F5",
    shadow: "transparent", 
    highlight: "#F4F4F5",
    gradientStart: "#18181B",
    gradientEnd: "#18181B",
    saveIcon: "#EAB308", 
  },
  dark: {
    background: "#09090B",
    surface: "#18181B",
    card: "#18181B",
    text: "#FAFAFA",
    mutedText: "#A1A1AA",
    primary: "#FAFAFA", 
    primaryLight: "#27272A",
    secondary: "#E4E4E7",
    accent: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    border: "#27272A",
    divider: "#27272A",
    shadow: "transparent",
    highlight: "#27272A",
    gradientStart: "#FAFAFA",
    gradientEnd: "#FAFAFA",
    saveIcon: "#FBBF24", 
  },
};

export const getColorsFor = (mode: ThemeMode) => themeColors[mode];
