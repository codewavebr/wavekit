"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useComplementaryColor } from "../theme";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface WorkoutData {
  name: string;
  completed: number;
  missed: number;
}

interface MultipleBarChartProps {
  data: WorkoutData[];
  title: string;
  description?: string;
}

type CustomTooltipPayload = {
  value?: number;
  color?: string;
  payload: {
    name: string;
  };
  dataKey?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  const complementaryColor = useComplementaryColor();

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--text-primary))",
        padding: "8px 12px",
        borderRadius: "8px",
        textAlign: "left",
        fontSize: "14px",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {payload.map((entry: CustomTooltipPayload, index: number) => {
        const value = typeof entry.value === "number" ? entry.value : 0;
        const label = entry.dataKey === "completed" ? "Realizados" : "Perdidos";
        const color =
          entry.dataKey === "completed"
            ? "hsl(var(--main-color))"
            : complementaryColor;

        return (
          <div
            key={`item-${index}`}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
            <span style={{ color: "hsl(var(--text-secondary))" }}>
              {label}:
            </span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </div>
  );
};

export function MultipleBarChartComponent({
  data,
  title,
  description,
}: MultipleBarChartProps) {
  const complementaryColor = useComplementaryColor();

  return (
    <Card className="flex h-full flex-col rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {description && <span className="text-sm">{description}</span>}
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={14}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={12} />
            <Bar
              dataKey="completed"
              fill="hsl(var(--main-color))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="missed"
              fill={complementaryColor}
              radius={[4, 4, 0, 0]}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
