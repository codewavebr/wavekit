"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import { cn } from "../utils";
import { ShellBrand } from "./shell-brand";
import { ShellNav } from "./shell-nav";
import type {
  WaveIconMap,
  WaveLinkComponent,
  WaveNavItem,
  WaveShellBrand,
} from "./types";

type ShellSidebarProps = {
  items: WaveNavItem[];
  activePath?: string | null;
  isMinimized: boolean;
  onToggle: () => void;
  iconMap: WaveIconMap;
  LinkComponent?: WaveLinkComponent;
  brand?: WaveShellBrand;
  className?: string;
};

export function ShellSidebar({
  items,
  activePath,
  isMinimized,
  onToggle,
  iconMap,
  LinkComponent,
  brand,
  className,
}: ShellSidebarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="sm:my-5 sm:ml-5">
      <nav
        className={cn(
          "relative hidden h-[calc(100vh-2.5rem)] flex-col rounded-2xl bg-mainColor md:flex",
          isAnimating && "duration-500",
          !isMinimized ? "w-60" : "w-[72px]",
          !brand && "pt-20",
          className,
        )}
      >
        <ChevronLeft
          className={cn(
            "absolute -right-3 cursor-pointer rounded-full bg-white text-3xl text-black shadow-lg transition-transform duration-700 ease-in-out",
            brand ? "top-8" : "top-20",
            isMinimized && "rotate-180",
          )}
          onClick={handleToggle}
          style={{ zIndex: 10 }}
        />
        {brand ? (
          <ShellBrand
            brand={brand}
            isMinimized={isMinimized}
            LinkComponent={LinkComponent}
          />
        ) : null}
        <div
          className={cn(
            "min-h-0 flex-1 space-y-1 py-2",
            brand ? "pt-12" : "mt-3",
          )}
        >
          <ShellNav
            activePath={activePath}
            iconMap={iconMap}
            isMinimized={isMinimized}
            items={items}
            LinkComponent={LinkComponent}
          />
        </div>
      </nav>
    </div>
  );
}
