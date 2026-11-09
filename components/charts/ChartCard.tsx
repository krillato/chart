import type { ReactNode } from "react";

export type ChartLibrary = "Recharts" | "ECharts" | "Chart.js" | "Victory";

const LIBRARY_BADGE: Record<ChartLibrary, string> = {
  Recharts: "bg-blue-50 text-blue-700",
  ECharts: "bg-red-50 text-red-700",
  "Chart.js": "bg-pink-50 text-pink-700",
  Victory: "bg-amber-50 text-amber-800",
};

type ChartCardProps = {
  title: string;
  library: ChartLibrary;
  note?: string;
  children: ReactNode;
};

export function ChartCard({ title, library, note, children }: ChartCardProps) {
  return (
    <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{title}</h3>
          {note && <p className="text-xs text-gray-500">{note}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${LIBRARY_BADGE[library]}`}>
          {library}
        </span>
      </header>
      {children}
    </section>
  );
}
