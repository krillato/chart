"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-data";
import {
  formatValue,
  type CartesianChartProps,
  type ChartRow,
  type ShareChartProps,
} from "../types";

const AXIS_TICK = { fontSize: 12, fill: "#6b7280" };

export function RechartsLineChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
  threshold,
}: CartesianChartProps<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={AXIS_TICK} interval={3} />
          <YAxis tick={AXIS_TICK} width={48} />
          <Tooltip formatter={(value) => formatValue(Number(value), unit)} />
          <Legend />
          {threshold && (
            <ReferenceLine
              y={threshold.value}
              stroke={CHART_COLORS.danger}
              strokeDasharray="6 4"
              label={{ value: threshold.label, position: "insideTopRight", fontSize: 11, fill: CHART_COLORS.danger }}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RechartsBarChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
}: CartesianChartProps<T>) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey={xKey} tick={AXIS_TICK} />
          <YAxis tick={AXIS_TICK} width={56} />
          <Tooltip formatter={(value) => formatValue(Number(value), unit)} />
          <Legend />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RechartsPieChart({ data, colors, unit, height = 260 }: ShareChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip formatter={(value) => formatValue(Number(value), unit)} />
          <Legend />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
