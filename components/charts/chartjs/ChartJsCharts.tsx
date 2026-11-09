"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartDataset,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { CHART_COLORS } from "@/lib/chart-data";
import {
  formatValue,
  toNumber,
  type CartesianChartProps,
  type ChartRow,
  type ShareChartProps,
} from "../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export function ChartJsLineChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
  threshold,
}: CartesianChartProps<T>) {
  const labels = data.map((row) => String(row[xKey]));

  const datasets: ChartDataset<"line", (number | null)[]>[] = series.map((s) => ({
    label: s.label,
    data: data.map((row) => toNumber(row[s.key])),
    borderColor: s.color,
    backgroundColor: s.color,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.35,
    spanGaps: false,
  }));

  if (threshold) {
    datasets.push({
      label: threshold.label,
      data: data.map(() => threshold.value),
      borderColor: CHART_COLORS.danger,
      backgroundColor: CHART_COLORS.danger,
      borderWidth: 1,
      borderDash: [6, 4],
      pointRadius: 0,
    });
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatValue(ctx.parsed.y ?? 0, unit)}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={{ labels, datasets }} options={options} />
    </div>
  );
}

export function ChartJsBarChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
}: CartesianChartProps<T>) {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatValue(ctx.parsed.y ?? 0, unit)}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar
        data={{
          labels: data.map((row) => String(row[xKey])),
          datasets: series.map((s) => ({
            label: s.label,
            data: data.map((row) => toNumber(row[s.key])),
            backgroundColor: s.color,
            borderRadius: 4,
          })),
        }}
        options={options}
      />
    </div>
  );
}

export function ChartJsDoughnutChart({ data, colors, unit, height = 260 }: ShareChartProps) {
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatValue(Number(ctx.raw), unit)}`,
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut
        data={{
          labels: data.map((d) => d.name),
          datasets: [{ data: data.map((d) => d.value), backgroundColor: colors, borderWidth: 0 }],
        }}
        options={options}
      />
    </div>
  );
}
