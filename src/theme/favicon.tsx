"use client";

import { useEffect } from "react";

import { useThemeColor } from "./theme-color-provider";

export type FaviconProps = {
  renderSvg?: (color: string) => string;
};

function defaultRenderSvg(color: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="12" ry="12" fill="${color}" />
      <path d="M18 40 30 14h8L26 40h-8Zm14 10 12-26h8L40 50h-8Z" fill="white" />
    </svg>
  `.trim();
}

export function Favicon({ renderSvg = defaultRenderSvg }: FaviconProps) {
  const { color } = useThemeColor();

  useEffect(() => {
    if (!color) return;

    const faviconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
      renderSvg(color),
    )}`;

    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (link.href !== faviconUrl) {
      link.href = faviconUrl;
    }
  }, [color, renderSvg]);

  return null;
}
