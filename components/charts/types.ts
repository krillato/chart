import type { ShareDatum } from "@/lib/chart-data";

export type ChartRow = Record<string, string | number | null>;

export type ChartSeries<T extends ChartRow> = {
  key: Extract<keyof T, string>;
  label: string;
  color: string;
};

export type CartesianChartProps<T extends ChartRow> = {
  data: T[];
  xKey: Extract<keyof T, string>;
  series: ChartSeries<T>[];
  unit?: string;
  height?: number;
  threshold?: { value: number; label: string };
};

export type ShareChartProps = {
  data: ShareDatum[];
  colors: string[];
  unit?: string;
  height?: number;
};

export function toNumber(value: string | number | null): number | null {
  return typeof value === "number" ? value : null;
}

export function formatValue(value: number, unit?: string) {
  return `${value.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
}
