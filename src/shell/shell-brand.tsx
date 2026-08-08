"use client";

import { cn } from "../utils";
import type { WaveLinkComponent, WaveShellBrand } from "./types";

const DefaultLink: WaveLinkComponent = ({
  href,
  children,
  className,
  onClick,
  "aria-label": ariaLabel,
}) => (
  <a href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
    {children}
  </a>
);

type ShellBrandProps = {
  brand: WaveShellBrand;
  isMinimized: boolean;
  LinkComponent?: WaveLinkComponent;
  onNavigate?: () => void;
  className?: string;
};

export function ShellBrand({
  brand,
  isMinimized,
  LinkComponent = DefaultLink,
  onNavigate,
  className,
}: ShellBrandProps) {
  const href = brand.href ?? "/";
  const ariaLabel =
    brand.ariaLabel ??
    (typeof brand.title === "string" ? brand.title : undefined);

  return (
    <div
      className={cn("flex w-full shrink-0 items-center pt-6 pb-4", className)}
    >
      <LinkComponent
        href={href}
        onClick={onNavigate}
        aria-label={ariaLabel}
        className="flex min-w-0 items-center text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-mainColor"
      >
        <span className="flex w-[72px] shrink-0 items-center justify-center">
          {brand.icon}
        </span>
        {brand.title != null ? (
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap text-[22px] tracking-tight text-white transition-all duration-300 ease-in-out",
              isMinimized
                ? "max-w-0 opacity-0"
                : "max-w-[200px] opacity-100 pr-3",
            )}
            aria-hidden={isMinimized}
          >
            {brand.title}
          </span>
        ) : null}
      </LinkComponent>
    </div>
  );
}
