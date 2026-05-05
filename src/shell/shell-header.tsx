"use client";

import { cn } from "../utils";
import type { ReactNode } from "react";

type ShellHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function ShellHeader({
  title,
  subtitle,
  actions,
  className,
}: ShellHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 lg:pl-10 lg:pr-14",
        className,
      )}
    >
      <div className="flex flex-col">
        <h1 className="hidden text-3xl font-bold lg:block">{title}</h1>
        {subtitle ? (
          <p className="mt-1 hidden text-muted-foreground lg:block">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="block lg:hidden" />
      <div className="flex items-center gap-4">{actions}</div>
    </div>
  );
}
