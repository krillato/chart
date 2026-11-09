"use client";

import { useSyncExternalStore } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { CHART_COLORS } from "@/lib/chart-data";
import {
  formatValue,
  type CartesianChartProps,
  type ChartRow,
  type ShareChartProps,
} from "../types";

const WIDTH = 520;
const TICK_STYLE = { tickLabels: { fontSize: 11, fill: "#6b7280" } };

const noopSubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function ChartSkeleton({ height }: { height: number }) {
  return <div className="animate-pulse rounded-lg bg-gray-100" style={{ height }} />;
}

export function VictoryLineChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
  threshold,
}: CartesianChartProps<T>) {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton height={height} />;

  return (
    <VictoryChart
      theme={VictoryTheme.clean}
      width={WIDTH}
      height={height}
      padding={{ top: 40, bottom: 40, left: 56, right: 16 }}
      domainPadding={{ y: 20 }}
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) => formatValue(Number(datum._y), unit)}
          labelComponent={<VictoryTooltip flyoutStyle={{ fill: "white" }} />}
        />
      }
    >
      <VictoryLegend
        x={56}
        y={4}
        orientation="horizontal"
        gutter={16}
        style={{ labels: { fontSize: 11 } }}
        data={series.map((s) => ({ name: s.label, symbol: { fill: s.color } }))}
      />
      <VictoryAxis tickFormat={(tick: string, index: number) => (index % 4 === 0 ? tick : "")} style={TICK_STYLE} />
      <VictoryAxis dependentAxis style={TICK_STYLE} />
      {series.map((s) => (
        <VictoryLine
          key={s.key}
          data={data}
          x={xKey}
          y={s.key}
          style={{ data: { stroke: s.color, strokeWidth: 2 } }}
        />
      ))}
      {threshold && (
        <VictoryLine
          data={data}
          x={xKey}
          y={() => threshold.value}
          style={{ data: { stroke: CHART_COLORS.danger, strokeWidth: 1, strokeDasharray: "6,4" } }}
        />
      )}
    </VictoryChart>
  );
}

export function VictoryBarChart<T extends ChartRow>({
  data,
  xKey,
  series,
  unit,
  height = 260,
}: CartesianChartProps<T>) {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton height={height} />;

  return (
    <VictoryChart
      theme={VictoryTheme.clean}
      width={WIDTH}
      height={height}
      domainPadding={{ x: 40 }}
      padding={{ top: 40, bottom: 40, left: 64, right: 16 }}
    >
      <VictoryLegend
        x={64}
        y={4}
        orientation="horizontal"
        gutter={16}
        style={{ labels: { fontSize: 11 } }}
        data={series.map((s) => ({ name: s.label, symbol: { fill: s.color } }))}
      />
      <VictoryAxis style={TICK_STYLE} />
      <VictoryAxis dependentAxis style={TICK_STYLE} />
      <VictoryGroup offset={18}>
        {series.map((s) => (
          <VictoryBar
            key={s.key}
            data={data}
            x={xKey}
            y={s.key}
            barWidth={16}
            labels={({ datum }) => formatValue(Number(datum._y), unit)}
            labelComponent={<VictoryTooltip />}
            style={{ data: { fill: s.color } }}
          />
        ))}
      </VictoryGroup>
    </VictoryChart>
  );
}

export function VictoryPieChart({ data, colors, unit, height = 260 }: ShareChartProps) {
  const isClient = useIsClient();
  if (!isClient) return <ChartSkeleton height={height} />;

  return (
    <VictoryPie
      width={WIDTH}
      height={height}
      data={data}
      x="name"
      y="value"
      innerRadius={60}
      padAngle={2}
      colorScale={colors}
      labels={({ datum }) => `${datum.name} ${formatValue(Number(datum.value), unit)}`}
      style={{ labels: { fontSize: 11, fill: "#374151" } }}
    />
  );
}
