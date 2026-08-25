"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { CHART_COLORS } from "@/components/dashboard/charts";
import { PeriodToggle, SeriesToggle } from "@/components/dashboard/period-toggle";

/** Matches Behance School Performance weeks (Week 04–Week 09) */
export const performanceWeekStats = [
  { name: "Week 04", students: 28, teachers: 18 },
  { name: "Week 05", students: 42, teachers: 32 },
  { name: "Week 06", students: 35, teachers: 48 },
  { name: "Week 07", students: 55, teachers: 38 },
  { name: "Week 08", students: 48, teachers: 52 },
  { name: "Week 09", students: 62, teachers: 45 },
];

const performanceMonthly = [
  { name: "Jan", students: 42, teachers: 30 },
  { name: "Feb", students: 48, teachers: 35 },
  { name: "Mar", students: 52, teachers: 40 },
  { name: "Apr", students: 58, teachers: 42 },
  { name: "May", students: 55, teachers: 48 },
  { name: "Jun", students: 62, teachers: 50 },
];

const tip = {
  backgroundColor: "#fff",
  border: "none",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(107,88,246,0.12)",
  fontSize: 12,
};

export function SchoolPerformanceChart({ className }: { className?: string }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [series, setSeries] = useState({ students: true, teachers: true });

  const data = period === "weekly" ? performanceWeekStats : performanceMonthly;
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        students: series.students ? d.students : undefined,
        teachers: series.teachers ? d.teachers : undefined,
      })),
    [data, series],
  );

  const toggleSeries = (key: string) => {
    setSeries((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">School Performance</h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Students & Teachers trend</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SeriesToggle
            series={[
              { key: "students", label: "Students", color: CHART_COLORS.purple },
              { key: "teachers", label: "Teachers", color: CHART_COLORS.teal },
            ]}
            active={series}
            onChange={toggleSeries}
          />
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#eceef5" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 70]}
            />
            <Tooltip contentStyle={tip} />
            <Legend
              iconType="circle"
              verticalAlign="bottom"
              height={28}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            {series.students ? (
              <Line
                type="monotone"
                dataKey="students"
                name="Students"
                stroke={CHART_COLORS.purple}
                strokeWidth={3}
                dot={{ r: 5, fill: CHART_COLORS.purple, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
                connectNulls={false}
              />
            ) : null}
            {series.teachers ? (
              <Line
                type="monotone"
                dataKey="teachers"
                name="Teachers"
                stroke={CHART_COLORS.teal}
                strokeWidth={3}
                dot={{ r: 5, fill: CHART_COLORS.teal, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
                connectNulls={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
