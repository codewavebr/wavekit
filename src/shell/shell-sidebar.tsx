"use client";

import { ChevronLeft } from "lucide-react";
import { useState } from "react";

import { cn } from "../utils";
import { ShellNav } from "./shell-nav";
import type { WaveIconMap, WaveLinkComponent, WaveNavItem } from "./types";

type ShellSidebarProps = {
  items: WaveNavItem[];
  activePath?: string | null;
  isMinimized: boolean;
  onToggle: () => void;
  iconMap: WaveIconMap;
  LinkComponent?: WaveLinkComponent;
  className?: string;
};

export function ShellSidebar({
  items,
  activePath,
  isMinimized,
  onToggle,
  iconMap,
  LinkComponent,
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
          "relative hidden h-[calc(100vh-2.5rem)] rounded-2xl bg-mainColor pt-20 md:block",
          isAnimating && "duration-500",
          !isMinimized ? "w-60" : "w-[72px]",
          className,
        )}
      >
        <ChevronLeft
          className={cn(
            "absolute -right-3 top-20 cursor-pointer rounded-full bg-white text-3xl text-black shadow-lg transition-transform duration-700 ease-in-out",
            isMinimized && "rotate-180",
          )}
          onClick={handleToggle}
          style={{ zIndex: 10 }}
        />
        <div className="h-full space-y-4 py-4">
          <div className="h-full py-2">
            <div className="mt-3 h-full space-y-1">
              <ShellNav
                activePath={activePath}
                iconMap={iconMap}
                isMinimized={isMinimized}
                items={items}
                LinkComponent={LinkComponent}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
