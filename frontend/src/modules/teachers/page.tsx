"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { ModuleHub } from "@/components/shared/module-hub";
import { Button } from "@/components/ui/button";
import { MockActionButton, MOCK_FORMS } from "@/components/shared/mock-action";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  mockTeachers,
  teacherSubjects,
  getTeachersBySubject,
  type TeacherProfile,
} from "@/mock/teachers";

const STATUS_BADGE = {
  active: { label: "Active", variant: "success" as const },
  on_leave: { label: "On Leave", variant: "warning" as const },
  critical: { label: "Critical", variant: "error" as const },
};

function TeacherAvatar({
  teacher,
  size = "md",
}: {
  teacher: TeacherProfile;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "size-9 text-[10px]", md: "size-16 text-sm", lg: "size-20 text-lg" };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        sizes[size],
      )}
      style={{ backgroundColor: teacher.avatarColor }}
    >
      {teacher.avatarInitials}
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: TeacherProfile }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        <TeacherAvatar teacher={teacher} />
        <p className="mt-3 text-sm font-bold">{teacher.name}</p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">{teacher.subject}</p>
        <Badge variant={STATUS_BADGE[teacher.status].variant} className="mt-2 text-[10px]">
          {STATUS_BADGE[teacher.status].label}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{teacher.classesCount} classes</span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#F4901F]">
          <Star className="size-3 fill-current" />
          {teacher.rating}
        </span>
      </div>
      <Button size="sm" variant="outline" className="mt-4 w-full rounded-xl" asChild>
        <Link href={`/teachers/${teacher.id}`}>View profile</Link>
      </Button>
    </div>
  );
}

function TeachersTable({ teachers }: { teachers: TeacherProfile[] }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]/70 text-[11px] uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Teacher</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Designation</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Classes</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-muted)]/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <TeacherAvatar teacher={teacher} size="sm" />
                    <div>
                      <p className="font-semibold">{teacher.name}</p>
                      <p className="text-xs text-[var(--muted)]">{teacher.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{teacher.subject}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{teacher.department}</td>
                <td className="px-4 py-3">{teacher.designation}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE[teacher.status].variant} className="text-[10px]">
                    {STATUS_BADGE[teacher.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#F4901F]">
                    <Star className="size-3.5 fill-current" />
                    {teacher.rating}
                  </span>
                </td>
                <td className="px-4 py-3">{teacher.classesCount}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" className="rounded-xl" asChild>
                    <Link href={`/teachers/${teacher.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {teachers.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--muted)]">No teachers match your filters.</p>
      ) : null}
    </div>
  );
}

function TeacherQuickPanel({ teacher }: { teacher: TeacherProfile }) {
  const sameSubject = getTeachersBySubject(teacher.subject).filter((t) => t.id !== teacher.id);

  return (
    <div className="sticky top-6 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
      <h3 className="mb-4 text-base font-semibold">Quick preview</h3>
      <div className="flex flex-col items-center text-center">
        <TeacherAvatar teacher={teacher} size="lg" />
        <p className="mt-4 text-lg font-bold text-[#6B58F6]">{teacher.name}</p>
        <p className="text-sm text-[var(--muted)]">{teacher.subject}</p>
        <div className="mt-3 flex gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#efeaff] text-[#6B58F6]">
            <Phone className="size-4" />
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-[#efeaff] text-[#6B58F6]">
            <Mail className="size-4" />
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">{teacher.about}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          ["Rating", `${teacher.rating}/5`],
          ["Classes", String(teacher.classesCount)],
          ["Students", String(teacher.studentsCount)],
          ["Status", STATUS_BADGE[teacher.status].label],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[var(--surface-muted)] p-2.5">
            <p className="text-[10px] uppercase text-[var(--muted)]">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
      {sameSubject.length > 0 ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <p className="text-xs font-semibold text-[var(--muted)]">Same subject</p>
          <div className="mt-2 flex -space-x-2">
            {sameSubject.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex size-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                style={{ backgroundColor: t.avatarColor }}
                title={t.name}
              >
                {t.avatarInitials}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <Button className="mt-5 w-full rounded-xl" asChild>
        <Link href={`/teachers/${teacher.id}`}>Open full profile</Link>
      </Button>
    </div>
  );
}

export function TeachersPage() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [selectedId, setSelectedId] = useState(mockTeachers[0].id);

  const filtered = useMemo(() => {
    let list = [...mockTeachers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q),
      );
    }
    if (subjectFilter !== "all") list = list.filter((t) => t.subject === subjectFilter);
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    return list;
  }, [search, subjectFilter, statusFilter, sort]);

  const selected =
    filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? mockTeachers[0];
  const criticalCount = mockTeachers.filter((t) => t.status === "critical").length;

  return (
    <ModuleHub
      title="Teachers"
      description="Manage faculty directory — switch between cards and table, open full teacher profiles."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Teachers" }]}
      actions={
        <MockActionButton
          label="Add Teachers"
          title="Add teacher"
          description="Add a new faculty member (demo)."
          fields={MOCK_FORMS.employee}
          submitLabel="Create teacher"
          className="rounded-xl"
          icon={<Plus className="size-4" />}
        />
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers..."
            className="rounded-xl pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[160px] rounded-xl">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {teacherSubjects.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="critical">Critical ({criticalCount})</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[120px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-0.5">
          <button
            type="button"
            onClick={() => setView("cards")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              view === "cards"
                ? "bg-[var(--surface)] text-[#6B58F6] shadow-sm"
                : "text-[var(--muted)]",
            )}
          >
            <LayoutGrid className="size-3.5" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              view === "table"
                ? "bg-[var(--surface)] text-[#6B58F6] shadow-sm"
                : "text-[var(--muted)]",
            )}
          >
            <List className="size-3.5" />
            Table
          </button>
        </div>
      </div>

      {criticalCount > 0 && statusFilter !== "critical" ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#FF394B]/30 bg-[#fff0f1] px-4 py-3 text-sm">
          <AlertTriangle className="size-4 text-[#FF394B]" />
          <span>
            <strong>{criticalCount} critical teachers</strong> require attention —{" "}
            <button
              type="button"
              className="font-medium text-[#FF394B] underline"
              onClick={() => setStatusFilter("critical")}
            >
              View critical list
            </button>
          </span>
        </div>
      ) : null}

      {view === "table" ? (
        <TeachersTable teachers={filtered} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((teacher) => (
                <div
                  key={teacher.id}
                  onMouseEnter={() => setSelectedId(teacher.id)}
                  onFocus={() => setSelectedId(teacher.id)}
                >
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-[var(--muted)]">
                No teachers match your filters.
              </p>
            ) : null}
          </div>
          <div className="xl:col-span-1">
            {selected ? <TeacherQuickPanel teacher={selected} /> : null}
          </div>
        </div>
      )}
    </ModuleHub>
  );
}
