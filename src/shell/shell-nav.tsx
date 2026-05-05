"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

import { cn } from "../utils";
import type { WaveIconMap, WaveLinkComponent, WaveNavItem } from "./types";

type ShellNavProps = {
  items: WaveNavItem[];
  activePath?: string | null;
  isMinimized?: boolean;
  iconMap: WaveIconMap;
  fallbackIcon?: string;
  LinkComponent?: WaveLinkComponent;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const DefaultLink: WaveLinkComponent = ({
  href,
  children,
  className,
  onClick,
}) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

export function ShellNav({
  items,
  activePath,
  isMinimized = false,
  iconMap,
  fallbackIcon = "arrowRight",
  LinkComponent = DefaultLink,
  setOpen,
}: ShellNavProps) {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(
    null,
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLElement | null>(null);

  const updateIndicator = () => {
    if (!navRef.current) return;

    const activeItem = navRef.current.querySelector<HTMLElement>(
      '[data-active="true"]',
    );

    if (!activeItem) {
      setIndicatorStyle({ top: 0, height: 0 });
      return;
    }

    const activeRect = activeItem.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    const indicatorHeight = 24;

    requestAnimationFrame(() => {
      setIndicatorStyle({
        top:
          activeRect.top -
          navRect.top +
          activeRect.height / 2 -
          indicatorHeight / 2,
        height: indicatorHeight,
      });
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(updateIndicator, 0);
    window.addEventListener("resize", updateIndicator);

    const observer = new MutationObserver(updateIndicator);
    if (navRef.current) {
      observer.observe(navRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
      observer.disconnect();
    };
  }, [activePath, openCategoryIndex, isMinimized]);

  if (!items?.length) return null;

  const renderNavItem = (item: WaveNavItem, index: number) => {
    const Icon = iconMap[item.icon || fallbackIcon] || iconMap[fallbackIcon];
    const hasSubItems = Boolean(item.items?.length);
    const isCategoryOpen = openCategoryIndex === index;
    const isActive = item.href === activePath;

    const content = (
      <div
        data-active={isActive}
        className={cn(
          "group ml-3 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
          item.disabled && "cursor-not-allowed opacity-80",
        )}
        onClick={() => {
          if (hasSubItems) {
            setOpenCategoryIndex((previous) =>
              previous === index ? null : index,
            );
          } else {
            setOpen?.(false);
          }
        }}
      >
        {Icon ? <Icon className="h-6 w-6" color="white" /> : null}
        <span
          className={cn(
            "mr-2 overflow-hidden truncate whitespace-nowrap text-white transition-all duration-300 ease-in-out",
            isMinimized ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100",
          )}
        >
          {item.title}
        </span>
        {hasSubItems && (
          <span
            className={cn(
              "ml-auto overflow-hidden transition-all duration-300 ease-in-out",
              isMinimized ? "max-w-0 opacity-0" : "max-w-[20px] opacity-100",
            )}
          >
            <ChevronDown
              className={cn(
                "text-3xl text-white transition-transform duration-500 ease-in-out",
                isCategoryOpen && "rotate-180",
              )}
              size={16}
            />
          </span>
        )}
      </div>
    );

    return (
      <div className="relative" key={`${item.title}-${index}`}>
        <LinkComponent href={item.href || "#"}>{content}</LinkComponent>

        {hasSubItems && isCategoryOpen && !isMinimized && (
          <div className="ml-6 mt-1 space-y-1">
            {item.items?.map((subItem, subIndex) => (
              <LinkComponent
                className={cn(
                  "group flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-150",
                  activePath === subItem.href ? "border-2 border-white" : "",
                  subItem.disabled && "cursor-not-allowed opacity-80",
                )}
                href={subItem.disabled ? "/" : subItem.href || "#"}
                key={`${subItem.title}-${subIndex}`}
                onClick={() => setOpen?.(false)}
              >
                <ChevronRight className="mr-2 text-white" size={12} />
                <span className="mr-2 truncate text-white transition-all duration-300 ease-in-out">
                  {subItem.title}
                </span>
              </LinkComponent>
            ))}
          </div>
        )}
      </div>
    );
  };

  const topItems = items.filter((item) => item.position !== "bottom");
  const bottomItems = items.filter((item) => item.position === "bottom");

  return (
    <nav ref={navRef} className="relative flex h-full flex-col justify-between">
      <span
        className="absolute left-0 h-6 w-1 rounded-r bg-white transition-all duration-300 ease-in-out"
        style={{
          top: `${indicatorStyle.top}px`,
          opacity: indicatorStyle.height > 0 ? 1 : 0,
        }}
      />
      <div className="grid items-start gap-2">{topItems.map(renderNavItem)}</div>
      <div className="mb-4 grid items-start gap-2">
        {bottomItems.map(renderNavItem)}
      </div>
    </nav>
  );
}
