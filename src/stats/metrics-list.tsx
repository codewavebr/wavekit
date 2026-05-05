"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface MetricItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  showCurrency?: boolean;
  showPercentage?: boolean;
}

export interface MetricsListProps {
  title: string;
  description?: string;
  metrics: MetricItem[];
  className?: string;
}

export function MetricsList({
  title,
  description,
  metrics,
  className,
}: MetricsListProps) {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-500";
      case "warning":
        return "bg-yellow-100 text-yellow-500";
      case "danger":
        return "bg-red-100 text-red-500";
      case "info":
        return "bg-blue-100 text-blue-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const formatValue = (
    value: string | number,
    showCurrency?: boolean,
    showPercentage?: boolean,
  ) => {
    if (showCurrency && typeof value === "number") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }

    if (showPercentage && typeof value === "number") {
      return `${value}%`;
    }

    return typeof value === "number" ? value.toLocaleString() : value;
  };

  return (
    <Card className={cn("h-full rounded-3xl", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {description && <span className="text-sm">{description}</span>}
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <div key={index} className="flex items-center">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    getVariantStyles(metric.variant || "default"),
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatValue(
                      metric.value,
                      metric.showCurrency,
                      metric.showPercentage,
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
