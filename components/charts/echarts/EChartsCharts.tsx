"use client";

import { useMemo } from "react";
import type { EChartsCoreOption } from "echarts/core";
import { buildAlarmHeatmap, buildMinutePower, CHART_COLORS, WEEK_DAYS } from "@/lib/chart-data";
import {
  formatValue,
  toNumber,
  type CartesianChartProps,
  type ChartRow,
  type ShareChartProps,
} from "../types";
import { useECharts } from "./useECharts";

function EChart({ option, height }: { option: EChartsCoreOption; height: number }) {
  const ref = useECharts(option);
  return <div ref={ref} style={{ height, width: "100%" }} />;
}

const GRID = { top: 40, right: 16, bottom: 28, left: 52 };

export function EChartsLineChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
  threshold,
}: CartesianChartProps<T>) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: GRID,
      legend: { top: 0 },
      tooltip: { trigger: "axis", valueFormatter: (v: unknown) => formatValue(Number(v), unit) },
      xAxis: { type: "category", data: data.map((row) => String(row[xKey])) },
      yAxis: { type: "value" },
      series: series.map((s, i) => ({
        type: "line",
        name: s.label,
        data: data.map((row) => toNumber(row[s.key])),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2 },
        color: s.color,
        markLine:
          threshold && i === 0
            ? {
                symbol: "none",
                lineStyle: { color: CHART_COLORS.danger, type: "dashed" },
                label: { formatter: threshold.label, color: CHART_COLORS.danger, position: "insideEndTop" },
                data: [{ yAxis: threshold.value }],
              }
            : undefined,
      })),
    }),
    [data, xKey, series, unit, threshold],
  );
  return <EChart option={option} height={height} />;
}

export function EChartsBarChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
}: CartesianChartProps<T>) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: GRID,
      legend: { top: 0 },
      tooltip: { trigger: "axis", valueFormatter: (v: unknown) => formatValue(Number(v), unit) },
      xAxis: { type: "category", data: data.map((row) => String(row[xKey])) },
      yAxis: { type: "value" },
      series: series.map((s) => ({
        type: "bar",
        name: s.label,
        data: data.map((row) => toNumber(row[s.key])),
        color: s.color,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      })),
    }),
    [data, xKey, series, unit],
  );
  return <EChart option={option} height={height} />;
}

export function EChartsPieChart({ data, colors, unit, height = 260 }: ShareChartProps) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      color: colors,
      tooltip: { trigger: "item", valueFormatter: (v: unknown) => formatValue(Number(v), unit) },
      legend: { bottom: 0 },
      series: [{ type: "pie", radius: ["50%", "75%"], center: ["50%", "45%"], data, padAngle: 2 }],
    }),
    [data, colors, unit],
  );
  return <EChart option={option} height={height} />;
}

export function EChartsLargeLineChart({ height = 300 }: { height?: number }) {
  const points = useMemo(() => buildMinutePower(7), []);
  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: { top: 24, right: 16, bottom: 72, left: 52 },
      tooltip: { trigger: "axis", valueFormatter: (v: unknown) => formatValue(Number(v), "kW") },
      xAxis: { type: "time" },
      yAxis: { type: "value" },
      dataZoom: [{ type: "inside" }, { type: "slider", bottom: 16 }],
      series: [
        {
          type: "line",
          name: "Power",
          data: points,
          showSymbol: false,
          sampling: "lttb",
          color: CHART_COLORS.line1,
          lineStyle: { width: 1 },
        },
      ],
    }),
    [points],
  );
  return <EChart option={option} height={height} />;
}

export function EChartsGaugeChart({ value, label, height = 260 }: { value: number; label: string; height?: number }) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      series: [
        {
          type: "gauge",
          min: 0,
          max: 100,
          progress: { show: true, width: 14 },
          axisLine: { lineStyle: { width: 14 } },
          pointer: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: { valueAnimation: true, formatter: "{value}%", fontSize: 28, offsetCenter: [0, "0%"] },
          title: { offsetCenter: [0, "35%"] },
          data: [{ value, name: label }],
        },
      ],
    }),
    [value, label],
  );
  return <EChart option={option} height={height} />;
}

export function EChartsHeatmapChart({ height = 300 }: { height?: number }) {
  const cells = useMemo(() => buildAlarmHeatmap(), []);
  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: { top: 16, right: 16, bottom: 64, left: 48 },
      tooltip: {
        formatter: (p: { value: [number, number, number] }) =>
          `${WEEK_DAYS[p.value[1]]} ${String(p.value[0]).padStart(2, "0")}:00 = ${p.value[2]} alarms`,
      },
      xAxis: { type: "category", data: Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0")) },
      yAxis: { type: "category", data: WEEK_DAYS },
      visualMap: { min: 0, max: 8, orient: "horizontal", left: "center", bottom: 8, inRange: { color: ["#eff6ff", "#dc2626"] } },
      series: [{ type: "heatmap", data: cells }],
    }),
    [cells],
  );
  return <EChart option={option} height={height} />;
}
