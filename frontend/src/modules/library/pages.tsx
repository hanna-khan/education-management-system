"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookCopy,
  BookMarked,
  BookOpen,
  Library,
  QrCode,
  ScanBarcode,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton } from "@/components/shared/mock-action";
import {
  LIBRARY_TABS,
  fineRatePerDay,
  libraryStats,
  lostBookReplacementFee,
  mockAuthors,
  mockBooks,
  mockCategories,
  mockCopies,
  mockDigitalResources,
  mockFines,
  mockIssues,
  mockMembers,
  mockPublishers,
  mockRacks,
  mockReservations,
  mockShelves,
  studentLibrarySummary,
} from "@/mock/library";
import { formatCurrency, formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Library" }];

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    available: "success",
    issued: "info",
    reserved: "warning",
    overdue: "error",
    lost: "error",
    damaged: "warning",
    maintenance: "outline",
    returned: "success",
    renewed: "info",
    unpaid: "error",
    paid: "success",
    waived: "info",
    partial: "warning",
    pending: "warning",
    ready: "success",
    fulfilled: "success",
    cancelled: "outline",
    expired: "error",
    active: "success",
    blocked: "error",
    trial: "info",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function LibraryDashboardPage() {
  return (
    <ModuleHub
      title="Library"
      description="NED Central Library — catalog, circulation, members, fines, and digital resources."
      breadcrumbs={breadcrumbs}
      tabs={LIBRARY_TABS}
      actions={
        <MockActionButton
          label="Quick issue"
          title="Issue book"
          fields={[
            { name: "barcode", label: "Copy barcode", required: true, placeholder: "NED-LIB-…" },
            { name: "member", label: "Member ID", required: true, placeholder: "CS-2022-0421" },
            { name: "days", label: "Loan days", type: "number", defaultValue: "14" },
          ]}
          submitLabel="Issue"
          icon={<BookCopy className="size-4" />}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Titles" value={formatNumber(libraryStats.totalBooks)} icon={BookOpen} change="Karachi campus" />
        <KpiCard label="Copies available" value={formatNumber(libraryStats.availableCopies)} icon={BookMarked} changeType="positive" />
        <KpiCard label="Issued today" value={libraryStats.issuedToday} icon={Library} />
        <KpiCard label="Overdue" value={libraryStats.overdue} icon={AlertCircle} changeType="negative" change="Follow up required" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Reservations" value={libraryStats.reservations} icon={BookCopy} />
        <KpiCard label="Members" value={formatNumber(libraryStats.members)} icon={Users} />
        <KpiCard label="Unpaid fines" value={formatCurrency(libraryStats.unpaidFines)} icon={Wallet} changeType="negative" />
        <KpiCard label="Digital resources" value={libraryStats.digitalResources} icon={Search} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent issues</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/library/circulation">Open circulation</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Barcode", "Title", "Member", "Due", "Status", "Fine"]}
              rows={mockIssues.slice(0, 5).map((iss) => [
                iss.copyBarcode,
                <Link key={iss.id} href={`/library/books/${iss.bookId}`} className="font-medium hover:underline">
                  {iss.bookTitle}
                </Link>,
                iss.memberName,
                iss.dueAt,
                statusBadge(iss.status),
                iss.fine ? formatCurrency(iss.fine) : "—",
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Floor occupancy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockShelves.map((sh) => {
              const pct = Math.round((sh.occupied / sh.capacity) * 100);
              return (
                <div key={sh.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{sh.code} · {sh.section}</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function LibraryCatalogPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return mockBooks;
    return mockBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(needle) ||
        b.isbn.includes(needle) ||
        b.authors.some((a) => a.toLowerCase().includes(needle)) ||
        b.category.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <ModuleHub
      title="Catalog"
      description="Search titles across CS, EE, ME, and general stacks."
      breadcrumbs={[...breadcrumbs, { label: "Catalog" }]}
      tabs={LIBRARY_TABS}
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input className="pl-9" placeholder="Search title, ISBN, author…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <MockToastButton label="Advanced search" message="Advanced catalog filters opened (demo)." variant="outline" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No titles found" description="Try a different keyword or clear the search." />
      ) : (
        <SimpleTable
          columns={["Title", "Authors", "Category", "Available", "Shelf", "Status"]}
          rows={filtered.map((b) => [
            <Link key={b.id} href={`/library/books/${b.id}`} className="font-medium hover:underline">
              {b.title}
            </Link>,
            b.authors.join(", "),
            b.category,
            `${b.copiesAvailable}/${b.copiesTotal}`,
            b.shelf,
            statusBadge(b.status),
          ])}
        />
      )}
    </ModuleHub>
  );
}

export function LibraryBooksPage() {
  return (
    <ModuleHub
      title="Books"
      description="Manage bibliographic records and holdings."
      breadcrumbs={[...breadcrumbs, { label: "Books" }]}
      tabs={LIBRARY_TABS}
      actions={
        <MockActionButton
          label="Add book"
          fields={[
            { name: "title", label: "Title", required: true },
            { name: "isbn", label: "ISBN", required: true },
            { name: "authors", label: "Authors", required: true },
            { name: "category", label: "Category", type: "select", options: mockCategories.map((c) => c.name), required: true },
            { name: "copies", label: "Copies", type: "number", defaultValue: "1" },
          ]}
          submitLabel="Add"
          icon={<BookOpen className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["ISBN", "Title", "Edition", "Year", "Copies", "Dewey", "Status"]}
        rows={mockBooks.map((b) => [
          b.isbn,
          <Link key={b.id} href={`/library/books/${b.id}`} className="font-medium hover:underline">
            {b.title}
          </Link>,
          b.edition,
          String(b.year),
          `${b.copiesAvailable}/${b.copiesTotal}`,
          b.dewey,
          statusBadge(b.status),
        ])}
      />
    </ModuleHub>
  );
}

export function LibraryBookDetailPage({ id }: { id: string }) {
  const book = mockBooks.find((b) => b.id === id) ?? mockBooks[0];
  const copies = mockCopies.filter((c) => c.bookId === book.id);

  return (
    <ModuleHub
      title={book.title}
      description={book.subtitle ?? book.description}
      breadcrumbs={[...breadcrumbs, { label: "Books", href: "/library/books" }, { label: book.title }]}
      tabs={LIBRARY_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <MockActionButton label="Reserve" fields={[{ name: "member", label: "Member ID", required: true }]} submitLabel="Reserve" successMessage="Reservation placed (demo)." />
          <MockToastButton label="Print spine label" message="Spine label sent to printer (demo)." variant="outline" />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="ISBN" value={book.isbn} />
        <InfoCard label="Publisher" value={book.publisher} />
        <InfoCard label="Location" value={`${book.shelf} / ${book.rack}`} />
        <InfoCard label="Availability" value={`${book.copiesAvailable} of ${book.copiesTotal}`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bibliographic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="text-[var(--muted)]">Authors: </span>{book.authors.join("; ")}</p>
            <p><span className="text-[var(--muted)]">Category: </span>{book.category} · Dewey {book.dewey}</p>
            <p><span className="text-[var(--muted)]">Edition / Year: </span>{book.edition} · {book.year}</p>
            <p><span className="text-[var(--muted)]">Language / Pages: </span>{book.language} · {book.pages} pp.</p>
            <p className="pt-2 text-[var(--foreground)]">{book.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {book.tags.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Copies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {copies.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No physical copies listed.</p>
            ) : (
              copies.map((c) => (
                <div key={c.id} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                  <p className="font-mono text-xs">{c.barcode}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="capitalize text-[var(--muted)]">{c.condition}</span>
                    {statusBadge(c.status)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleHub>
  );
}

export function LibraryAuthorsPage() {
  return (
    <ModuleHub title="Authors" description="Author authority records." breadcrumbs={[...breadcrumbs, { label: "Authors" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Name", "Nationality", "Titles"]}
        rows={mockAuthors.map((a) => [a.name, a.nationality, String(a.booksCount)])}
      />
    </ModuleHub>
  );
}

export function LibraryPublishersPage() {
  return (
    <ModuleHub title="Publishers" description="Publisher directory." breadcrumbs={[...breadcrumbs, { label: "Publishers" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Publisher", "City", "Country", "Titles"]}
        rows={mockPublishers.map((p) => [p.name, p.city, p.country, String(p.booksCount)])}
      />
    </ModuleHub>
  );
}

export function LibraryCategoriesPage() {
  return (
    <ModuleHub title="Categories" description="Classification categories (Dewey-aligned)." breadcrumbs={[...breadcrumbs, { label: "Categories" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Code", "Category", "Titles"]}
        rows={mockCategories.map((c) => [c.code, c.name, formatNumber(c.booksCount)])}
      />
    </ModuleHub>
  );
}

export function LibraryShelvesPage() {
  return (
    <ModuleHub title="Shelves" description="Physical shelf map by floor." breadcrumbs={[...breadcrumbs, { label: "Shelves" }]} tabs={LIBRARY_TABS}
      actions={<MockActionButton label="Add shelf" fields={[{ name: "code", label: "Shelf code", required: true }, { name: "floor", label: "Floor", required: true }, { name: "section", label: "Section", required: true }]} submitLabel="Create" />}
    >
      <SimpleTable
        columns={["Code", "Floor", "Section", "Occupied", "Capacity"]}
        rows={mockShelves.map((s) => [s.code, s.floor, s.section, formatNumber(s.occupied), formatNumber(s.capacity)])}
      />
    </ModuleHub>
  );
}

export function LibraryRacksPage() {
  return (
    <ModuleHub title="Racks" description="Rack-level holdings." breadcrumbs={[...breadcrumbs, { label: "Racks" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Rack", "Shelf", "Rows", "Books"]}
        rows={mockRacks.map((r) => [r.code, r.shelfCode, String(r.rows), String(r.booksCount)])}
      />
    </ModuleHub>
  );
}

export function LibraryCopiesPage() {
  return (
    <ModuleHub title="Copies" description="Barcode-level copy inventory." breadcrumbs={[...breadcrumbs, { label: "Copies" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Barcode", "Title", "Shelf/Rack", "Condition", "Status", "Acquired"]}
        rows={mockCopies.map((c) => [c.barcode, c.bookTitle, `${c.shelf}/${c.rack}`, c.condition, statusBadge(c.status), c.acquired])}
      />
    </ModuleHub>
  );
}

export function LibraryMembersPage() {
  return (
    <ModuleHub
      title="Members"
      description="Students, faculty, and staff library accounts."
      breadcrumbs={[...breadcrumbs, { label: "Members" }]}
      tabs={LIBRARY_TABS}
      actions={
        <MockActionButton
          label="Register member"
          fields={[
            { name: "memberId", label: "Member ID", required: true },
            { name: "name", label: "Full name", required: true },
            { name: "type", label: "Type", type: "select", options: ["student", "faculty", "staff", "alumni"], required: true },
            { name: "department", label: "Department", required: true },
          ]}
          submitLabel="Register"
          icon={<Users className="size-4" />}
        />
      }
    >
      <SimpleTable
        columns={["Member ID", "Name", "Type", "Department", "Issued", "Overdue", "Fines", "Status"]}
        rows={mockMembers.map((m) => [
          m.memberId,
          m.name,
          m.type,
          m.department,
          `${m.issuedCount}/${m.maxBooks}`,
          String(m.overdueCount),
          formatCurrency(m.fineBalance),
          statusBadge(m.status),
        ])}
      />
    </ModuleHub>
  );
}

export function LibraryCirculationPage() {
  const [barcode, setBarcode] = useState("");
  const [memberId, setMemberId] = useState("");
  const [daysOverdue, setDaysOverdue] = useState(5);
  const finePreview = daysOverdue * fineRatePerDay;

  return (
    <ModuleHub
      title="Circulation"
      description="Issue, return, renew, reserve, and mark lost/damaged — with fine calculation."
      breadcrumbs={[...breadcrumbs, { label: "Circulation" }]}
      tabs={LIBRARY_TABS}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanBarcode className="size-5 text-[var(--brand-primary)]" />
              Desk operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="ems-label">Scan / enter barcode</label>
                <Input className="mt-1.5 font-mono" placeholder="NED-LIB-00018422" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              </div>
              <div>
                <label className="ems-label">Member ID</label>
                <Input className="mt-1.5" placeholder="CS-2022-0421" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <MockToastButton label="Issue" message={`Issued ${barcode || "copy"} to ${memberId || "member"} (demo).`} />
              <MockToastButton label="Return" message="Return recorded (demo)." variant="outline" />
              <MockToastButton label="Renew" message="Loan renewed +14 days (demo)." variant="outline" />
              <MockToastButton label="Reserve" message="Reservation queued (demo)." variant="outline" />
              <MockActionButton
                label="Mark lost"
                title="Mark copy lost"
                fields={[
                  { name: "barcode", label: "Barcode", defaultValue: barcode, required: true },
                  { name: "fee", label: "Replacement fee (PKR)", type: "number", defaultValue: String(lostBookReplacementFee) },
                ]}
                submitLabel="Confirm lost"
                successMessage="Copy marked lost; fine raised (demo)."
                variant="destructive"
              />
              <MockToastButton label="Mark damaged" message="Damaged condition saved (demo)." variant="outline" />
            </div>
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <QrCode className="size-4" />
                Barcode / QR scan mock
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Point scanner at spine label or member card. Demo accepts manual entry above.
              </p>
              <MockToastButton className="mt-3" label="Simulate scan" message="Scanned NED-LIB-00018422 → Introduction to Algorithms (demo)." variant="outline" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fine calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="ems-label">Days overdue</label>
              <Input
                className="mt-1.5"
                type="number"
                min={0}
                value={daysOverdue}
                onChange={(e) => setDaysOverdue(Number(e.target.value) || 0)}
              />
            </div>
            <InfoCard label="Rate" value={`${formatCurrency(fineRatePerDay)} / day`} />
            <InfoCard label="Estimated fine" value={formatCurrency(finePreview)} sub="PKR" />
            <InfoCard label="Lost replacement" value={formatCurrency(lostBookReplacementFee)} />
            <MockToastButton label="Apply fine" message={`Fine of ${formatCurrency(finePreview)} applied (demo).`} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active loans</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Barcode", "Title", "Member", "Issued", "Due", "Renewals", "Status"]}
            rows={mockIssues
              .filter((i) => i.status === "issued" || i.status === "overdue")
              .map((i) => [i.copyBarcode, i.bookTitle, i.memberName, i.issuedAt, i.dueAt, String(i.renewals), statusBadge(i.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function LibraryReservationsPage() {
  return (
    <ModuleHub title="Reservations" description="Hold queue and ready-for-pickup." breadcrumbs={[...breadcrumbs, { label: "Reservations" }]} tabs={LIBRARY_TABS}>
      <SimpleTable
        columns={["Title", "Member", "Reserved", "Expires", "Queue", "Status"]}
        rows={mockReservations.map((r) => [r.bookTitle, r.memberName, r.reservedAt, r.expiresAt, String(r.queuePosition || "—"), statusBadge(r.status)])}
      />
    </ModuleHub>
  );
}

export function LibraryOverduePage() {
  const overdue = mockIssues.filter((i) => i.status === "overdue");
  return (
    <ModuleHub
      title="Overdue"
      description="Loans past due date."
      breadcrumbs={[...breadcrumbs, { label: "Overdue" }]}
      tabs={LIBRARY_TABS}
      actions={<MockToastButton label="Send reminders" message="SMS/email reminders queued (demo)." />}
    >
      <SimpleTable
        columns={["Title", "Member", "Due", "Fine", "Status"]}
        rows={overdue.map((i) => [i.bookTitle, i.memberName, i.dueAt, formatCurrency(i.fine), statusBadge(i.status)])}
      />
    </ModuleHub>
  );
}

export function LibraryFinesPage() {
  return (
    <ModuleHub
      title="Fines"
      description="Overdue, lost, and damaged charges in PKR."
      breadcrumbs={[...breadcrumbs, { label: "Fines" }]}
      tabs={LIBRARY_TABS}
      actions={<MockToastButton label="Collect payment" message="Fine payment recorded (demo)." />}
    >
      <SimpleTable
        columns={["Member", "Title", "Reason", "Amount", "Paid", "Status", "Date"]}
        rows={mockFines.map((f) => [
          f.memberName,
          f.bookTitle,
          f.reason,
          formatCurrency(f.amount),
          formatCurrency(f.paid),
          statusBadge(f.status),
          f.createdAt,
        ])}
      />
    </ModuleHub>
  );
}

export function LibraryDigitalPage() {
  return (
    <ModuleHub title="Digital resources" description="Databases, e-journals, theses, and HEC Digital Library." breadcrumbs={[...breadcrumbs, { label: "Digital" }]} tabs={LIBRARY_TABS}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockDigitalResources.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold tracking-tight">{r.title}</p>
                {statusBadge(r.status)}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{r.provider} · {r.type}</p>
              <p className="mt-3 text-sm text-[var(--muted)]">{r.subjects.join(", ")}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{formatNumber(r.subscribers)} subscribers</p>
              <MockToastButton className="mt-4" label="Open access" message={`Opening ${r.title} (demo).`} size="sm" variant="outline" />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function LibraryReportsPage() {
  return (
    <ModuleHub title="Reports" description="Circulation and holdings reports." breadcrumbs={[...breadcrumbs, { label: "Reports" }]} tabs={LIBRARY_TABS}
      actions={<MockToastButton label="Export PDF" message="Library report exported (demo)." />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Circulation this month" value="4,820" />
        <InfoCard label="Avg loan duration" value="11 days" />
        <InfoCard label="Most borrowed" value="CLRS / Algorithms" />
        <InfoCard label="Collection utilization" value="68%" />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Category holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Category", "Titles", "Share"]}
            rows={mockCategories.map((c) => [
              c.name,
              formatNumber(c.booksCount),
              `${Math.round((c.booksCount / libraryStats.totalBooks) * 100)}%`,
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function LibrarySettingsPage() {
  return (
    <ModuleHub
      title="Library settings"
      description="Loan periods, fine rates, and member limits (mock)."
      breadcrumbs={[...breadcrumbs, { label: "Settings" }]}
      tabs={LIBRARY_TABS}
      actions={<MockToastButton label="Save settings" message="Library settings saved (demo)." icon={<Settings className="size-4" />} />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="Student loan period" value="14 days" />
        <InfoCard label="Faculty loan period" value="30 days" />
        <InfoCard label="Fine per day" value={formatCurrency(fineRatePerDay)} />
        <InfoCard label="Max renewals" value="2" />
        <InfoCard label="Student book limit" value="5" />
        <InfoCard label="Lost replacement fee" value={formatCurrency(lostBookReplacementFee)} />
      </div>
    </ModuleHub>
  );
}

export function StudentLibraryPage() {
  const { borrowed, reservations, fines, history } = studentLibrarySummary;
  return (
    <ModuleHub
      title="My Library"
      description="Borrowed books, dues, reservations, and fines."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Library" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Borrowed" value={borrowed.length} icon={BookOpen} />
        <KpiCard label="Overdue" value={borrowed.filter((b) => b.status === "overdue").length} icon={AlertCircle} changeType="negative" />
        <KpiCard label="Reservations" value={reservations.length} icon={BookCopy} />
        <KpiCard label="Open fines" value={formatCurrency(fines.filter((f) => f.status !== "paid" && f.status !== "waived").reduce((s, f) => s + (f.amount - f.paid), 0))} icon={Wallet} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Currently borrowed</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Title", "Due", "Status", "Fine"]}
            rows={borrowed.map((b) => [b.bookTitle, b.dueAt, statusBadge(b.status), b.fine ? formatCurrency(b.fine) : "—"])}
          />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Reservations</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Title", "Status", "Expires"]}
              rows={reservations.map((r) => [r.bookTitle, statusBadge(r.status), r.expiresAt])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fines</CardTitle>
            <MockToastButton label="Pay fines" message="Redirected to fee portal (demo)." size="sm" />
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Title", "Amount", "Status"]}
              rows={fines.map((f) => [f.bookTitle, formatCurrency(f.amount - f.paid), statusBadge(f.status)])}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Title", "Issued", "Returned / Status"]}
            rows={history.map((h) => [h.bookTitle, h.issuedAt, h.returnedAt ?? statusBadge(h.status)])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}
