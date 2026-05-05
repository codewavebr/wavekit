"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface AttendanceData {
  date: string;
  attendance: number;
}

interface AreaChartProps {
  data: AttendanceData[];
  title: string;
  description?: string;
}

type CustomTooltipPayload = {
  value?: number;
  payload: {
    date: string;
    attendance: number;
  };
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
                backgroundColor: "hsl(var(--main-color))",
              }}
            />
            <span style={{ color: "hsl(var(--text-secondary))" }}>
              {entry.payload.date}:
            </span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </div>
  );
};

export function AreaChartComponent({
  data,
  title,
  description,
}: AreaChartProps) {
  return (
    <Card className="h-full rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {description && <span className="text-sm">{description}</span>}
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={14}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={12} />
            <Area
              type="natural"
              dataKey="attendance"
              stroke="hsl(var(--main-color))"
              fill="transparent"
              strokeWidth={4}
              strokeLinecap="round"
              activeDot={{
                stroke: "#FFFFFF",
                strokeWidth: 6,
                fill: "hsl(var(--main-color))",
                r: 6,
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
