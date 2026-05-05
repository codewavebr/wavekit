"use client";

import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui";
import { cn } from "../utils";
import type { WaveIconMap, WaveNavItem } from "./types";

type ShellMobileNavProps = {
  items: WaveNavItem[];
  activePath?: string | null;
  iconMap: WaveIconMap;
  onNavigate: (href: string) => void;
  fallbackIcon?: string;
};

export function ShellMobileNav({
  items,
  activePath,
  iconMap,
  onNavigate,
  fallbackIcon = "arrowRight",
}: ShellMobileNavProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const container = document.querySelector("main");
    if (!container) return;

    let lastScroll = container.scrollTop;
    const onScroll = () => {
      setHidden(container.scrollTop > lastScroll);
      lastScroll = container.scrollTop;
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 transition-all duration-500 md:hidden",
        hidden
          ? "pointer-events-none translate-y-32 opacity-0"
          : "pointer-events-auto translate-y-0 opacity-100",
      )}
    >
      <div
        className="scrollbar-hide flex justify-start gap-6 overflow-x-auto rounded-2xl bg-mainColor px-5 py-6 shadow-lg"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => {
          const Icon = iconMap[item.icon || fallbackIcon] || iconMap[fallbackIcon];
          const isActive =
            item.href === "/"
              ? activePath === "/"
              : Boolean(item.href && activePath?.startsWith(item.href));
          const hasSubItems = Boolean(item.items?.length);

          if (hasSubItems) {
            return (
              <DropdownMenu key={item.label || item.title || index}>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex flex-col items-center justify-center rounded-xl text-white">
                    {isActive ? (
                      <span className="pointer-events-none absolute -bottom-4 left-1/2 h-1 w-6 -translate-x-1/2 transform rounded-t bg-white" />
                    ) : null}
                    {Icon ? <Icon className="h-7 w-7" /> : null}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} align="center">
                  {item.items?.map((subItem, subIndex) => (
                    <DropdownMenuItem
                      key={`${subItem.title}-${subIndex}`}
                      onClick={() => onNavigate(subItem.href || "/")}
                      className={cn(
                        activePath === subItem.href
                          ? "bg-accent text-accent-foreground"
                          : "",
                      )}
                    >
                      {subItem.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <button
              key={item.label || item.title || index}
              className="relative flex flex-col items-center justify-center rounded-xl text-white"
              onClick={() => item.href && onNavigate(item.href)}
            >
              {isActive ? (
                <span className="pointer-events-none absolute -bottom-6 left-1/2 h-1 w-6 -translate-x-1/2 transform rounded-t bg-white" />
              ) : null}
              {Icon ? <Icon className="h-7 w-7" /> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
