"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  showCurrency?: boolean;
  showPercentage?: boolean;
  layout?: "horizontal" | "vertical";
}

export function StatCard({
  title,
  value,
  label,
  icon: Icon,
  variant = "default",
  size = "md",
  className,
  showCurrency = false,
  showPercentage = false,
  layout = "vertical",
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (showCurrency && typeof val === "number") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(val);
    }

    if (showPercentage && typeof val === "number") {
      return `${val > 0 ? "+" : ""}${val}%`;
    }

    return typeof val === "number" ? val.toLocaleString() : val;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "danger":
        return "text-red-600";
      default:
        return "text-foreground";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-lg";
      case "lg":
        return "text-3xl";
      default:
        return "text-2xl";
    }
  };

  const getLayoutStyles = () => {
    if (layout === "horizontal") {
      return "flex-row items-center justify-between";
    }

    return "flex-col justify-between";
  };

  return (
    <Card className={cn("rounded-3xl shadow-sm", className)}>
      <CardHeader className={cn("flex", getLayoutStyles())}>
        <div className="flex w-full items-center justify-between">
          <CardTitle className="font-semibold">{title}</CardTitle>
          {Icon && <Icon className="h-6 w-6 text-mainColor" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("font-bold", getVariantStyles(), getSizeStyles())}>
          {formatValue(value)}
        </div>
        {label && <div className="text-sm text-muted-foreground">{label}</div>}
      </CardContent>
    </Card>
  );
}
