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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface RevenueData {
  month: string;
  mensalidades: number;
  produtos: number;
  servicos: number;
}

interface StackedBarChartProps {
  data: RevenueData[];
  title: string;
  description?: string;
}

type CustomTooltipPayload = {
  value?: number;
  color?: string;
  payload: {
    month: string;
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
  if (!active || !payload || !payload.length) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getLabel = (dataKey: string) => {
    switch (dataKey) {
      case "mensalidades":
        return "Mensalidades";
      case "produtos":
        return "Produtos";
      case "servicos":
        return "Serviços";
      default:
        return dataKey;
    }
  };

  const getColor = (dataKey: string) => {
    switch (dataKey) {
      case "mensalidades":
        return "hsl(var(--main-color))";
      case "produtos":
        return "hsl(var(--main-color)/.6)";
      case "servicos":
        return "hsl(var(--main-color)/.3)";
      default:
        return "hsl(var(--main-color))";
    }
  };

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
        const label = getLabel(entry.dataKey || "");
        const color = getColor(entry.dataKey || "");

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
            <strong>{formatCurrency(value)}</strong>
          </div>
        );
      })}
    </div>
  );
};

export function StackedBarChartComponent({
  data,
  title,
  description,
}: StackedBarChartProps) {
  const totalRevenue = data.reduce((total, item) => {
    return total + item.mensalidades + item.produtos + item.servicos;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="h-full rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <span className="text-sm">{description}</span>}
        </div>
        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
            barGap={20}
          >
            <CartesianGrid strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={14}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Bar
              dataKey="mensalidades"
              stackId="revenue"
              fill="hsl(var(--main-color))"
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="produtos"
              stackId="revenue"
              fill="hsl(var(--main-color)/.6)"
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="servicos"
              stackId="revenue"
              fill="hsl(var(--main-color)/.3)"
              radius={[4, 4, 4, 4]}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
