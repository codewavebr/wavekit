"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface PlanData {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: PlanData[];
  title: string;
  description?: string;
}

// Cores baseadas em --main-color
const COLORS = [
  "hsl(var(--main-color))",
  "hsl(var(--main-color)/.8)",
  "hsl(var(--main-color)/.6)",
  "hsl(var(--main-color)/.4)",
  "hsl(var(--main-color)/.2)",
];

// Tooltip customizada
const CustomTooltip = ({ active, payload }: any) => {
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
      {payload.map((entry: any, index: number) => {
        const value = typeof entry.value === "number" ? entry.value : 0;

        // Pegamos a cor a partir do índice
        const color = COLORS[index % COLORS.length] || "#999";

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
              {entry.payload.name}:
            </span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </div>
  );
};

export function DonutChartComponent({
  data,
  title,
  description,
}: DonutChartProps) {
  return (
    <Card className="h-full rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {description && <span className="text-sm">{description}</span>}
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={70}
              paddingAngle={3}
              stroke="transparent"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
