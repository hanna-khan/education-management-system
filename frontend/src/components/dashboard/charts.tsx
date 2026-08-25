"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export const CHART_COLORS = {
  purple: "#6B58F6",
  teal: "#1BD0B4",
  orange: "#F4901F",
  coral: "#FF394B",
  mint: "#5DFB88",
  violet: "#8C4AF2",
  blue: "#3B82F6",
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, actions, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

const tip = {
  backgroundColor: "#fff",
  border: "none",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(107,88,246,0.12)",
  fontSize: 12,
};

export function PerformanceAreaChart({
  data,
}: {
  data: { name: string; students: number; teachers: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.purple} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS.purple} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradTeachers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.teal} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.teal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf5" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tip} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="students" name="Students" stroke={CHART_COLORS.purple} strokeWidth={2.5} fill="url(#gradStudents)" />
          <Area type="monotone" dataKey="teachers" name="Teachers" stroke={CHART_COLORS.teal} strokeWidth={2.5} fill="url(#gradTeachers)" strokeDasharray="6 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FinanceLineChart({
  data,
}: {
  data: { name: string; income: number; expense: number }[];
}) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf5" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tip} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 4 }} />
          <Line type="monotone" dataKey="income" name="Income" stroke={CHART_COLORS.teal} strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="expense" name="Expense" stroke={CHART_COLORS.orange} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttendanceDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tip} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarTrend({
  data,
  color = CHART_COLORS.purple,
}: {
  data: { name: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-36 items-end gap-2">
      {data.map((item) => (
        <div key={item.name} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-lg"
            style={{
              height: `${(item.value / max) * 100}%`,
              background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
              minHeight: 8,
            }}
            title={`${item.name}: ${item.value}`}
          />
          <span className="text-[10px] font-medium text-[var(--muted)]">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
