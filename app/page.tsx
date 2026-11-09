import type { ReactNode } from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import type { ChartSeries } from "@/components/charts/types";
import {
  ChartJsBarChart,
  ChartJsDoughnutChart,
  ChartJsLineChart,
} from "@/components/charts/chartjs/ChartJsCharts";
import {
  EChartsBarChart,
  EChartsGaugeChart,
  EChartsHeatmapChart,
  EChartsLargeLineChart,
  EChartsLineChart,
  EChartsPieChart,
} from "@/components/charts/echarts/EChartsCharts";
import {
  RechartsBarChart,
  RechartsLineChart,
  RechartsPieChart,
} from "@/components/charts/recharts/RechartsCharts";
import {
  VictoryBarChart,
  VictoryLineChart,
  VictoryPieChart,
} from "@/components/charts/victory/VictoryCharts";
import {
  CHART_COLORS,
  energyByLine,
  energyShare,
  oeePercent,
  POWER_LIMIT_KW,
  powerByHour,
  SHARE_COLORS,
  type EnergyByLine,
  type PowerByHour,
} from "@/lib/chart-data";

const powerSeries: ChartSeries<PowerByHour>[] = [
  { key: "line1", label: "Line 1", color: CHART_COLORS.line1 },
  { key: "line2", label: "Line 2", color: CHART_COLORS.line2 },
  { key: "line3", label: "Line 3", color: CHART_COLORS.line3 },
];

const energySeries: ChartSeries<EnergyByLine>[] = [
  { key: "actual", label: "Actual", color: CHART_COLORS.line1 },
  { key: "target", label: "Target", color: CHART_COLORS.target },
];

const threshold = { value: POWER_LIMIT_KW, label: `Limit ${POWER_LIMIT_KW} kW` };

const COMPARISON = [
  { topic: "วาดด้วย", recharts: "SVG", echarts: "Canvas (เลือก SVG ได้)", chartjs: "Canvas", victory: "SVG" },
  { topic: "วิธีเขียน", recharts: "React component (JSX)", echarts: "option object ก้อนเดียว", chartjs: "config object ผ่าน react-chartjs-2", victory: "React component (JSX)" },
  { topic: "ข้อมูลจำนวนมาก", recharts: "เริ่มหน่วงเมื่อจุดเยอะ (SVG ทีละจุด)", echarts: "ดีที่สุด มี sampling และ dataZoom", chartjs: "พอใช้ มี decimation plugin", victory: "เริ่มหน่วงเมื่อจุดเยอะ (SVG)" },
  { topic: "ชนิดกราฟ", recharts: "พื้นฐานครบ", echarts: "เยอะที่สุด: gauge, heatmap, map, sankey, candlestick", chartjs: "พื้นฐาน + plugin", victory: "พื้นฐาน + polar" },
  { topic: "ความง่ายในทีม React", recharts: "ง่ายที่สุด", echarts: "ต้องเรียนรู้ option และ lifecycle เอง", chartjs: "ง่าย config ตรงไปตรงมา", victory: "ง่าย แต่ปรับ layout ละเอียดยากกว่า" },
  { topic: "Responsive", recharts: "ResponsiveContainer", echarts: "ต้องเรียก resize() เอง (ทำไว้ใน hook)", chartjs: "responsive + maintainAspectRatio", victory: "ยืดตามความกว้างผ่าน viewBox" },
  { topic: "จุดเด่นอื่น", recharts: "ชุมชนใหญ่ ตัวอย่างเยอะ", echarts: "zoom, brush, visualMap, ใช้นอก React ได้", chartjs: "เบา และใช้นอก React ได้", victory: "มี victory-native สำหรับ React Native" },
];

export default function ChartsPage() {
  return (
    <main className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">เปรียบเทียบ Chart Libraries</h1>
          <p className="text-sm text-gray-600">
            ข้อมูลชุดเดียวกัน วาดด้วย Recharts, Apache ECharts, Chart.js และ Victory ทุก component รับ props
            แบบเดียวกัน (<code>data</code>, <code>xKey</code>, <code>series</code>, <code>unit</code>) จึงสลับ library ได้
          </p>
        </header>

        <Section title="1. Line chart: กำลังไฟ 24 ชั่วโมง" description="Line 1 ไม่มีข้อมูลช่วง 10:00–11:00 ต้องเป็นช่องว่าง ไม่ใช่ลากลงศูนย์ และมีเส้นเกณฑ์">
          <ChartCard title="Power (kW)" library="Recharts" note="ReferenceLine">
            <RechartsLineChart data={powerByHour} xKey="time" series={powerSeries} unit="kW" threshold={threshold} />
          </ChartCard>
          <ChartCard title="Power (kW)" library="ECharts" note="markLine">
            <EChartsLineChart data={powerByHour} xKey="time" series={powerSeries} unit="kW" threshold={threshold} />
          </ChartCard>
          <ChartCard title="Power (kW)" library="Chart.js" note="dataset เส้นประแทน annotation plugin">
            <ChartJsLineChart data={powerByHour} xKey="time" series={powerSeries} unit="kW" threshold={threshold} />
          </ChartCard>
          <ChartCard title="Power (kW)" library="Victory" note="VictoryVoronoiContainer สำหรับ tooltip">
            <VictoryLineChart data={powerByHour} xKey="time" series={powerSeries} unit="kW" threshold={threshold} />
          </ChartCard>
        </Section>

        <Section title="2. Bar chart: พลังงานตามสายการผลิต" description="เทียบค่าจริงกับเป้าหมาย">
          <ChartCard title="Energy by line (kWh)" library="Recharts">
            <RechartsBarChart data={energyByLine} xKey="line" series={energySeries} unit="kWh" />
          </ChartCard>
          <ChartCard title="Energy by line (kWh)" library="ECharts">
            <EChartsBarChart data={energyByLine} xKey="line" series={energySeries} unit="kWh" />
          </ChartCard>
          <ChartCard title="Energy by line (kWh)" library="Chart.js">
            <ChartJsBarChart data={energyByLine} xKey="line" series={energySeries} unit="kWh" />
          </ChartCard>
          <ChartCard title="Energy by line (kWh)" library="Victory">
            <VictoryBarChart data={energyByLine} xKey="line" series={energySeries} unit="kWh" />
          </ChartCard>
        </Section>

        <Section title="3. Donut chart: สัดส่วนการใช้พลังงาน" description="ใช้เมื่อมีไม่กี่กลุ่มและรวมกันได้ 100%">
          <ChartCard title="Energy share (%)" library="Recharts">
            <RechartsPieChart data={energyShare} colors={SHARE_COLORS} unit="%" />
          </ChartCard>
          <ChartCard title="Energy share (%)" library="ECharts">
            <EChartsPieChart data={energyShare} colors={SHARE_COLORS} unit="%" />
          </ChartCard>
          <ChartCard title="Energy share (%)" library="Chart.js">
            <ChartJsDoughnutChart data={energyShare} colors={SHARE_COLORS} unit="%" />
          </ChartCard>
          <ChartCard title="Energy share (%)" library="Victory">
            <VictoryPieChart data={energyShare} colors={SHARE_COLORS} unit="%" />
          </ChartCard>
        </Section>

        <Section title="4. งานที่ ECharts ทำได้เด่น" description="ข้อมูลเยอะ, ซูม และกราฟเฉพาะทางที่ library อื่นไม่มีในตัว">
          <div className="lg:col-span-2">
            <ChartCard title="Power ทุกนาที 7 วัน (10,080 จุด)" library="ECharts" note="sampling: lttb + dataZoom ลากหรือ scroll เพื่อซูม">
              <EChartsLargeLineChart />
            </ChartCard>
          </div>
          <ChartCard title="OEE" library="ECharts" note="Gauge">
            <EChartsGaugeChart value={oeePercent} label="A × P × Q" />
          </ChartCard>
          <ChartCard title="Alarm ตามวันและชั่วโมง" library="ECharts" note="Heatmap + visualMap">
            <EChartsHeatmapChart />
          </ChartCard>
        </Section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">ตารางเปรียบเทียบ</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3">หัวข้อ</th>
                  <th className="p-3">Recharts</th>
                  <th className="p-3">ECharts</th>
                  <th className="p-3">Chart.js</th>
                  <th className="p-3">Victory</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.topic} className="border-t border-gray-100 align-top">
                    <th className="p-3 font-medium">{row.topic}</th>
                    <td className="p-3">{row.recharts}</td>
                    <td className="p-3">{row.echarts}</td>
                    <td className="p-3">{row.chartjs}</td>
                    <td className="p-3">{row.victory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">ควรเลือกแบบไหน</h2>
            <p className="text-sm text-gray-600">
              ไม่มีตัวที่ดีที่สุดสำหรับทุกงาน ให้เลือกจากขนาดข้อมูล ชนิดกราฟที่ต้องใช้ และ platform ของโปรเจกต์
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">ถามตัวเองตามลำดับนี้</h3>
            <ol className="space-y-2 text-sm">
              {DECISION_STEPS.map((step, i) => (
                <li key={step.question} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    {step.question} <span className="font-semibold">→ {step.answer}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <ul className="grid gap-4 text-sm md:grid-cols-2">
            {CHOICES.map((choice) => (
              <Choice key={choice.title} {...choice} />
            ))}
          </ul>

          <div className="space-y-3">
            <h3 className="font-semibold">ตัวอย่างสถานการณ์</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3">งาน</th>
                    <th className="p-3">เลือก</th>
                    <th className="p-3">เพราะ</th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIOS.map((s) => (
                    <tr key={s.task} className="border-t border-gray-100 align-top">
                      <td className="p-3">{s.task}</td>
                      <td className="p-3 font-medium">{s.pick}</td>
                      <td className="p-3 text-gray-600">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            ในโปรเจกต์จริงควรเลือกตัวหลักตัวเดียว แล้วครอบเป็น component กลางแบบในหน้านี้ ถ้าต้องเปลี่ยน library ภายหลัง
            จะแก้แค่ไฟล์ข้างใน ไม่ต้องตามแก้ทุกหน้า ใช้สอง library ในโปรเจกต์เดียวเฉพาะเมื่อมีเหตุผลชัด เช่น ใช้ Recharts
            กับ dashboard ทั่วไป แต่ใช้ ECharts กับหน้า monitoring ที่ข้อมูลเยอะ
          </p>
        </section>
      </div>
    </main>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

type ChoiceInfo = {
  title: string;
  when: string;
  reasons: string[];
  examples: string[];
  avoid: string[];
};

function Choice({ title, when, reasons, examples, avoid }: ChoiceInfo) {
  return (
    <li className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="text-gray-600">{when}</p>
      </div>
      <ChoiceList label="เหตุผล" items={reasons} tone="text-gray-900" />
      <ChoiceList label="ตัวอย่างงาน" items={examples} tone="text-blue-700" />
      <ChoiceList label="ไม่เหมาะเมื่อ" items={avoid} tone="text-red-700" />
    </li>
  );
}

function ChoiceList({ label, items, tone }: { label: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className={`text-xs font-semibold ${tone}`}>{label}</p>
      <ul className="list-disc space-y-1 pl-5 text-gray-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const DECISION_STEPS = [
  { question: "ข้อมูลต่อกราฟเกินหลายพันจุด ต้องซูม หรือต้องใช้ gauge, heatmap, map ไหม", answer: "ECharts" },
  { question: "ต้องใช้กราฟชุดเดียวกันบน React Native ด้วยไหม", answer: "Victory" },
  { question: "โปรเจกต์ไม่ได้ใช้ React หรืออยากได้ library ที่เบาที่สุด", answer: "Chart.js" },
  { question: "ไม่เข้าข้อไหนเลย (dashboard React ทั่วไป)", answer: "Recharts" },
];

const CHOICES: ChoiceInfo[] = [
  {
    title: "Recharts",
    when: "Dashboard ทั่วไปในทีม React ข้อมูลหลักร้อยถึงหลักพันจุดต่อกราฟ",
    reasons: [
      "เขียนเป็น JSX แบบ component ปกติ อ่านและแก้ง่ายสำหรับคนเขียน React",
      "ส่ง array ของ object เข้าไปตรงๆ ไม่ต้องแปลงรูปแบบข้อมูล",
      "มี Tooltip, Legend, ReferenceLine และ ResponsiveContainer ในตัว",
      "ใช้กันแพร่หลาย หาตัวอย่างง่าย",
    ],
    examples: [
      "หน้ารายงานยอดขาย 12 เดือน",
      "Bar chart จำนวน order แยกตามสถานะ",
      "Sparkline เล็กๆ ในการ์ด KPI",
    ],
    avoid: [
      "จุดข้อมูลเป็นหมื่นขึ้นไป เพราะ SVG สร้าง element ทีละจุด หน้าจะหน่วง",
      "ต้องการ heatmap, gauge หรือแผนที่",
    ],
  },
  {
    title: "ECharts",
    when: "Time series ข้อมูลเยอะ ต้องซูม หรือต้องใช้กราฟเฉพาะทาง",
    reasons: [
      "วาดบน Canvas รับข้อมูลจำนวนมากได้ดีกว่า SVG",
      "มี sampling แบบ LTTB และ dataZoom ในตัว (กราฟ 10,080 จุดในหน้านี้)",
      "มีชนิดกราฟมากที่สุด เช่น gauge, heatmap, sankey, candlestick, map",
      "ตั้งค่าทั้งหมดใน option object เดียว backend ส่ง config มาได้",
    ],
    examples: [
      "Monitoring กำลังไฟของเครื่องจักรทุกนาทีย้อนหลัง 30 วัน",
      "Gauge แสดง OEE และ heatmap ของ downtime ตามวันและชั่วโมง",
      "Dashboard โรงงาน IoT และพลังงาน",
    ],
    avoid: [
      "มีกราฟง่ายๆ ไม่กี่อัน เพราะต้องเขียน hook จัดการ init, resize, dispose เอง",
      "ห่วงขนาด bundle แต่ไม่ได้ import แยกเฉพาะส่วนที่ใช้",
    ],
  },
  {
    title: "Chart.js",
    when: "กราฟมาตรฐานไม่กี่แบบ อยากได้ library เบา หรือโปรเจกต์ไม่ได้ใช้ React",
    reasons: [
      "เขียนเป็น config ตรงไปตรงมา เรียนรู้เร็ว",
      "วาดบน Canvas และ responsive ในตัว",
      "ใช้ได้ทุก framework หรือแม้แต่ JavaScript ล้วน",
    ],
    examples: [
      "เพิ่มกราฟในระบบหลังบ้านเก่าที่ใช้ jQuery หรือ PHP",
      "หน้าสรุปรายงานรายเดือนที่มี line และ doughnut ไม่กี่อัน",
      "Widget กราฟที่ฝังในหลายเว็บ",
    ],
    avoid: [
      "ต้องการปรับแต่งลึก เพราะต้องเขียน plugin เอง",
      "ต้องการเส้นเกณฑ์หรือ annotation แต่ไม่อยากลง plugin เพิ่ม",
    ],
  },
  {
    title: "Victory",
    when: "ต้องใช้กราฟชุดเดียวกันทั้งเว็บและ React Native",
    reasons: [
      "API แบบ component เหมือนกันทั้งเว็บและ victory-native",
      "ควบคุม SVG และ animation ได้ละเอียด",
    ],
    examples: [
      "แอปสุขภาพหรือฟิตเนสบน React Native ที่มีเว็บแอดมินแสดงกราฟเดียวกัน",
      "กราฟที่ต้องการ animation หรือ interaction เฉพาะตัว",
    ],
    avoid: [
      "Next.js ที่ render บน server เพราะเจอ hydration mismatch ในหน้านี้ ต้องให้ render หลัง mount",
      "ข้อมูลจำนวนมาก เพราะเป็น SVG เหมือน Recharts",
    ],
  },
];

const SCENARIOS = [
  { task: "หน้า KPI ยอดขายรายเดือน 12 จุด", pick: "Recharts", reason: "ข้อมูลน้อย กราฟพื้นฐาน เขียนเร็ว" },
  { task: "Monitor เซนเซอร์ 200 เครื่อง ย้อนหลัง 30 วัน", pick: "ECharts", reason: "ข้อมูลเป็นแสนจุด ต้อง downsample และซูม" },
  { task: "หน้า OEE ที่มี gauge และ heatmap downtime", pick: "ECharts", reason: "มี gauge และ heatmap ในตัว" },
  { task: "ระบบเก่า PHP + jQuery อยากเพิ่มกราฟสรุป", pick: "Chart.js", reason: "ไม่ต้องพึ่ง React และเบา" },
  { task: "แอป React Native + เว็บแอดมิน แสดงกราฟเดียวกัน", pick: "Victory", reason: "ใช้ API เดียวกันทั้งสอง platform" },
  { task: "Sparkline เล็กๆ ในการ์ด KPI 4 ใบ", pick: "Recharts", reason: "เบาพอ และใช้ร่วมกับ dashboard React ได้ทันที" },
];
