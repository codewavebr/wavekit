"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "../utils";
import { StatCard } from "./stat-card";

export interface StatCardData {
  title: string;
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showCurrency?: boolean;
  showPercentage?: boolean;
}

export interface StatCardsGridProps {
  cards: StatCardData[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatCardsGrid({
  cards,
  columns = 3,
  className,
}: StatCardsGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-3";
    }
  };

  return (
    <div className={cn("grid gap-4", getGridCols(), className)}>
      {cards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          label={card.label}
          icon={card.icon}
          variant={card.variant}
          size={card.size}
          showCurrency={card.showCurrency}
          showPercentage={card.showPercentage}
        />
      ))}
    </div>
  );
}
