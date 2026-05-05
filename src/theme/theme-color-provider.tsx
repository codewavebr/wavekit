"use client";

import convert from "color-convert";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { defaultThemeColor } from "./tokens";

export type ThemeColorContextValue = {
  color: string;
  setColor: (hex: string) => void;
  previewColor: string;
  setPreviewColor: (hex: string) => void;
  applyPreview: () => void;
  colorHSL: string;
};

const ThemeColorContext = createContext<ThemeColorContextValue | undefined>(
  undefined,
);

export function hexToHslVariable(hex: string) {
  const [h, s, l] = convert.hex.hsl(hex);
  return `${h} ${s}% ${l}%`;
}

export function setThemeColorCssVars(colorHex: string) {
  if (typeof window === "undefined") return;

  const colorHSL = hexToHslVariable(colorHex);
  document.documentElement.style.setProperty("--primary", colorHSL);
  document.documentElement.style.setProperty("--main-color", colorHSL);
}

export function ThemeColorProvider({
  children,
  initialColor = defaultThemeColor,
}: {
  children: ReactNode;
  initialColor?: string;
}) {
  const [color, setColorState] = useState(initialColor);
  const [previewColor, setPreviewColorState] = useState(initialColor);

  useEffect(() => {
    setThemeColorCssVars(initialColor);
  }, [initialColor]);

  const colorHSL = useMemo(() => {
    try {
      return hexToHslVariable(color);
    } catch {
      return "10 96% 65%";
    }
  }, [color]);

  function setColor(newColorHex: string) {
    setColorState(newColorHex);
    setPreviewColorState(newColorHex);
    setThemeColorCssVars(newColorHex);
  }

  function setPreviewColor(newPreviewHex: string) {
    setPreviewColorState(newPreviewHex);
    setThemeColorCssVars(newPreviewHex);
  }

  function applyPreview() {
    setColor(previewColor);
  }

  return (
    <ThemeColorContext.Provider
      value={{
        color,
        setColor,
        previewColor,
        setPreviewColor,
        applyPreview,
        colorHSL,
      }}
    >
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);

  if (!context) {
    throw new Error("useThemeColor must be used within ThemeColorProvider");
  }

  return context;
}
