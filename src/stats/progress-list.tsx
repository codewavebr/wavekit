"use client";

import { cn } from "../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

export interface ProgressItem {
  name: string;
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showPercentage?: boolean;
  showValue?: boolean;
}

export interface ProgressListProps {
  title: string;
  description?: string;
  orientation?: string;
  items: ProgressItem[];
  className?: string;
}

export function ProgressList({
  title,
  description,
  orientation,
  items,
  className,
}: ProgressListProps) {
  const formatValue = (
    value: number,
    max: number = 100,
    showPercentage?: boolean,
    showValue?: boolean,
  ) => {
    if (showPercentage) {
      return `${Math.round((value / max) * 100)}%`;
    }

    if (showValue) {
      return `${value}/${max}`;
    }

    return `${Math.round((value / max) * 100)}%`;
  };

  return (
    <Card className={cn("h-full w-full rounded-3xl", className)}>
      <CardHeader
        className={cn(
          "gap-2",
          orientation === "row" && "flex flex-row items-center justify-between",
          orientation === "column" && "flex flex-col items-start",
        )}
      >
        <div className="flex flex-col">
          <CardTitle>{title}</CardTitle>
          {description && orientation === "column" && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>

        {description && orientation === "row" && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const max = item.max || 100;
            const percentage = (item.value / max) * 100;

            return (
              <div className="space-y-2" key={index}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{item.name}</Label>
                  <span className="text-sm font-medium">
                    {formatValue(
                      item.value,
                      max,
                      item.showPercentage,
                      item.showValue,
                    )}
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
