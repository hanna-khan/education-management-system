"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";

export interface ModuleTab {
  id: string;
  label: string;
  href: string;
}

interface ModuleHubProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  tabs?: ModuleTab[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** When true, skip PageHeader (useful for custom dashboard heroes). */
  hideHeader?: boolean;
}

function isTabActive(pathname: string, tab: ModuleTab, tabs: ModuleTab[]) {
  if (pathname === tab.href) return true;
  const baseHref = tabs[0]?.href;
  if (tab.href === baseHref) {
    return pathname === baseHref;
  }
  return pathname.startsWith(`${tab.href}/`);
}

export function ModuleHub({
  title,
  description,
  breadcrumbs,
  tabs,
  actions,
  children,
  hideHeader = false,
}: ModuleHubProps) {
  const pathname = usePathname();

  return (
    <div className="animate-fade-in space-y-6">
      {!hideHeader ? (
        <PageHeader
          breadcrumbs={<Breadcrumb items={breadcrumbs} />}
          title={title}
          description={description}
          actions={actions}
        />
      ) : breadcrumbs.length > 0 ? (
        <Breadcrumb items={breadcrumbs} />
      ) : null}
      {tabs && tabs.length > 0 ? (
        <nav className="flex flex-wrap gap-1 border-b border-[var(--border)] pb-px">
          {tabs.map((tab) => {
            const active = isTabActive(pathname, tab, tabs);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-[var(--brand-primary)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                {tab.label}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--brand-primary)]" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      ) : null}
      {children}
    </div>
  );
}

export function InfoCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-xs)]">
      <p className="ems-label">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-[var(--muted)]">{sub}</p> : null}
    </div>
  );
}

export function SimpleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xs)]">
      <div className="overflow-x-auto ems-scrollbar">
        <table className="w-full text-sm">
          <thead className="ems-table-header">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-[var(--border-subtle)] hover:bg-[var(--table-row-hover)]">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
