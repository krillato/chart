export const CHART_COLORS = {
  line1: "#2563eb",
  line2: "#16a34a",
  line3: "#f59e0b",
  target: "#9ca3af",
  danger: "#dc2626",
} as const;

export const SHARE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea"];

export const POWER_LIMIT_KW = 650;

const wave = (hour: number, base: number, amplitude: number, phase: number) =>
  Math.round(base + amplitude * Math.sin(((hour + phase) / 24) * Math.PI * 2));

export type PowerByHour = {
  time: string;
  line1: number | null;
  line2: number;
  line3: number;
};

export const powerByHour: PowerByHour[] = Array.from({ length: 24 }, (_, hour) => ({
  time: `${String(hour).padStart(2, "0")}:00`,
  line1: hour === 10 || hour === 11 ? null : wave(hour, 520, 160, 18),
  line2: wave(hour, 380, 110, 16),
  line3: wave(hour, 260, 70, 20),
}));

export type EnergyByLine = {
  line: string;
  actual: number;
  target: number;
};

export const energyByLine: EnergyByLine[] = [
  { line: "Line 1", actual: 8200, target: 9000 },
  { line: "Line 2", actual: 6100, target: 5800 },
  { line: "Line 3", actual: 4100, target: 4500 },
  { line: "Utility", actual: 2600, target: 2400 },
];

export type ShareDatum = {
  name: string;
  value: number;
};

export const energyShare: ShareDatum[] = [
  { name: "Compressor", value: 38 },
  { name: "Production", value: 29 },
  { name: "HVAC", value: 24 },
  { name: "Lighting", value: 9 },
];

export const oee = { availability: 0.9, performance: 0.9, quality: 0.95 };

export const oeePercent = Math.round(oee.availability * oee.performance * oee.quality * 1000) / 10;

const MINUTE = 60 * 1000;
const START = Date.UTC(2026, 10, 1);

export function buildMinutePower(days = 7): [number, number][] {
  return Array.from({ length: days * 24 * 60 }, (_, i) => {
    const hour = (i / 60) % 24;
    const daily = 420 + 180 * Math.sin(((hour - 6) / 24) * Math.PI * 2);
    const noise = 40 * Math.sin(i * 0.37) + 25 * Math.sin(i * 1.91);
    const spike = i % 1440 === 600 ? 260 : 0;
    return [START + i * MINUTE, Math.round(daily + noise + spike)];
  });
}

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildAlarmHeatmap(): [number, number, number][] {
  const cells: [number, number, number][] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const workHours = hour >= 8 && hour <= 18 ? 3 : 0;
      const weekend = day >= 5 ? -2 : 0;
      cells.push([hour, day, Math.max(0, ((hour * 7 + day * 13) % 5) + workHours + weekend)]);
    }
  }
  return cells;
}
