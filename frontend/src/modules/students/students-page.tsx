"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Filter,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { KpiCard } from "@/components/shared/kpi-card";
import { DataTable } from "@/components/tables/data-table";
import { studentColumns } from "@/modules/students/columns";
import { Button } from "@/components/ui/button";
import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getStudents,
  getStudentFilterOptions,
  getStudentStats,
} from "@/services/students";
import type { Student, StudentFilters } from "@/types/students";
import { GraduationCap, ClipboardCheck, AlertCircle, Users } from "lucide-react";

export function StudentsPageContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Student[]>([]);
  const [filters, setFilters] = useState<StudentFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    programs: string[];
    semesters: number[];
  }>({ departments: [], programs: [], semesters: [] });
  const [stats, setStats] = useState({ total: 0, active: 0, overdue: 0, avgAttendance: "0" });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [result, options, statsData] = await Promise.all([
      getStudents(filters, 1, 100),
      getStudentFilterOptions(),
      getStudentStats(),
    ]);
    setStudents(result.data);
    setFilterOptions(options);
    setStats(statsData);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({ ...current, search: searchInput || undefined }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeFilterCount = useMemo(() => {
    return [
      filters.department && filters.department !== "all",
      filters.program && filters.program !== "all",
      filters.status && filters.status !== "all",
      filters.feeStatus && filters.feeStatus !== "all",
      filters.semester && filters.semester !== "all",
    ].filter(Boolean).length;
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchInput("");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        breadcrumbs={
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Students" }]} />
        }
        title="Students"
        description="Search, filter, and manage the complete student registry across all programs and departments."
        actions={
          <>
            <MockToastButton label="Import" message="Student import started (demo)." icon={<Upload className="size-4" />} />
            <MockToastButton label="Export" message="Student list exported (demo)." icon={<Download className="size-4" />} />
            <MockActionButton
              label="Add student"
              title="Add student"
              description="Register a new student (demo)."
              fields={MOCK_FORMS.student}
              submitLabel="Create student"
              icon={<Plus className="size-4" />}
            />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total students" value={stats.total.toString()} icon={Users} />
        <KpiCard label="Active" value={stats.active.toString()} changeType="positive" icon={GraduationCap} />
        <KpiCard label="Avg. attendance" value={`${stats.avgAttendance}%`} icon={ClipboardCheck} />
        <KpiCard label="Fee overdue" value={stats.overdue.toString()} changeType="negative" icon={AlertCircle} />
      </div>

      <div className="ems-card-premium p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, ID, email, program..."
              className="h-9 border-[var(--border-subtle)] bg-[var(--surface-muted)] pl-9 shadow-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4" />
              Filters
              {activeFilterCount > 0 ? (
                <Badge variant="default" className="ml-1 h-5 min-w-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              ) : null}
            </Button>
            {activeFilterCount > 0 ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4" />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {showFilters ? (
          <div className="mt-4 grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Department"
              value={filters.department ?? "all"}
              onChange={(v) => setFilters((f) => ({ ...f, department: v }))}
              options={filterOptions.departments}
            />
            <FilterSelect
              label="Program"
              value={filters.program ?? "all"}
              onChange={(v) => setFilters((f) => ({ ...f, program: v }))}
              options={filterOptions.programs}
            />
            <FilterSelect
              label="Status"
              value={filters.status ?? "all"}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  status: v as StudentFilters["status"],
                }))
              }
              options={["active", "inactive", "graduated", "suspended", "on_leave"]}
            />
            <FilterSelect
              label="Fee status"
              value={filters.feeStatus ?? "all"}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  feeStatus: v as StudentFilters["feeStatus"],
                }))
              }
              options={["paid", "partial", "overdue", "waived"]}
            />
            <FilterSelect
              label="Semester"
              value={filters.semester?.toString() ?? "all"}
              onChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  semester: v === "all" ? "all" : Number(v),
                }))
              }
              options={filterOptions.semesters.map(String)}
            />
          </div>
        ) : null}

        {selected.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2">
            <span className="text-sm text-[var(--muted)]">
              {selected.length} selected
            </span>
            <Button variant="outline" size="sm">Export selected</Button>
            <Button variant="outline" size="sm">Send notice</Button>
            <Button variant="outline" size="sm" className="text-[var(--error)]">
              Archive selected
            </Button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={studentColumns}
          data={students}
          pageSize={10}
          onSelectionChange={setSelected}
          emptyMessage="No students match your search or filters."
        />
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="ems-label">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder={`All ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="capitalize">
              {opt.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
