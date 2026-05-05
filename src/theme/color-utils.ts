"use client";

import { useEffect, useState } from "react";

function getMainColorParts() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const mainColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--main-color")
    .trim();
  const hslValues = mainColor.split(" ");

  if (hslValues.length !== 3) return null;

  return {
    h: parseFloat(hslValues[0]),
    s: parseFloat(hslValues[1]),
    l: parseFloat(hslValues[2]),
  };
}

function colorFromMainHue(offset: number, fallback: string) {
  try {
    const parts = getMainColorParts();

    if (!parts) return fallback;
    if (parts.l <= 10) return "hsl(0, 0%, 100%)";

    const hue = (parts.h + offset) % 360;
    return `hsl(${hue}, ${parts.s}%, ${parts.l}%)`;
  } catch {
    return fallback;
  }
}

function useThemeDerivedColor(getColor: () => string) {
  const [color, setColor] = useState(getColor);

  useEffect(() => {
    const updateColor = () => setColor(getColor());

    updateColor();

    const rootObserver = new MutationObserver(updateColor);
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const headObserver = new MutationObserver(updateColor);
    headObserver.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      rootObserver.disconnect();
      headObserver.disconnect();
    };
  }, [getColor]);

  return color;
}

export function getComplementaryColor() {
  return colorFromMainHue(180, "hsl(200, 100%, 60%)");
}

export function useComplementaryColor() {
  return useThemeDerivedColor(getComplementaryColor);
}

export function getAnalogousColor(offset = 30) {
  return colorFromMainHue(offset, "hsl(230, 100%, 60%)");
}

export function useAnalogousColor(offset = 30) {
  return useThemeDerivedColor(() => getAnalogousColor(offset));
}

export function getTriadicColor(position: 1 | 2 | 3 = 1) {
  return colorFromMainHue(position * 120, "hsl(280, 100%, 60%)");
}

export function useTriadicColor(position: 1 | 2 | 3 = 1) {
  return useThemeDerivedColor(() => getTriadicColor(position));
}

export function getMainColorWithOpacity(opacity: number) {
  return `hsl(var(--main-color)/${opacity})`;
}

export function useColorPalette() {
  const complementary = useComplementaryColor();
  const analogous = useAnalogousColor();
  const triadic1 = useTriadicColor(1);
  const triadic2 = useTriadicColor(2);
  const triadic3 = useTriadicColor(3);

  return {
    primary: "hsl(var(--main-color))",
    complementary,
    analogous,
    triadic1,
    triadic2,
    triadic3,
    opacity80: getMainColorWithOpacity(0.8),
    opacity60: getMainColorWithOpacity(0.6),
    opacity40: getMainColorWithOpacity(0.4),
    opacity20: getMainColorWithOpacity(0.2),
  };
}

export function getColorPalette() {
  return {
    primary: "hsl(var(--main-color))",
    complementary: getComplementaryColor(),
    analogous: getAnalogousColor(),
    triadic1: getTriadicColor(1),
    triadic2: getTriadicColor(2),
    triadic3: getTriadicColor(3),
    opacity80: getMainColorWithOpacity(0.8),
    opacity60: getMainColorWithOpacity(0.6),
    opacity40: getMainColorWithOpacity(0.4),
    opacity20: getMainColorWithOpacity(0.2),
  };
}
