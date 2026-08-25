"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Inbox,
  Megaphone,
  MessageSquareWarning,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRecentSearches, mockSearchResults } from "@/mock/navigation-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { SearchResult } from "@/types";

const TYPE_ICONS = {
  student: GraduationCap,
  teacher: User,
  course: BookOpen,
  application: Inbox,
  notice: Megaphone,
  document: FileText,
  complaint: MessageSquareWarning,
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase();
    return mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized) ||
        item.meta?.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-[var(--border)] px-4 py-4">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search students, teachers, courses, applications, and more.
          </DialogDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students, courses, applications..."
              className="h-11 border-0 bg-[var(--surface-muted)] pl-10 shadow-none focus-visible:ring-0"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] text-[var(--muted)] sm:inline">
              ESC
            </kbd>
          </div>
        </DialogHeader>

        <div className="max-h-[420px] overflow-y-auto p-2 ems-scrollbar">
          {!query.trim() ? (
            <div className="p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {mockRecentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-[var(--muted-foreground)]">
                Tip: Press <kbd className="rounded border px-1">Ctrl</kbd> +{" "}
                <kbd className="rounded border px-1">K</kbd> anywhere to open search.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-[var(--foreground)]">No results found</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Try searching by student name, ID, course code, or application ID.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result) => (
                <SearchResultRow
                  key={result.id}
                  result={result}
                  onSelect={() => onOpenChange(false)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchResultRow({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: () => void;
}) {
  const Icon = TYPE_ICONS[result.type];

  return (
    <Link
      href={result.href}
      onClick={onSelect}
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
    >
      <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[var(--secondary)] text-[var(--brand-primary)]">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {result.title}
          </p>
          <Badge variant="outline" className="capitalize">
            {result.type}
          </Badge>
        </div>
        <p className="truncate text-sm text-[var(--muted)]">{result.subtitle}</p>
        {result.meta ? (
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{result.meta}</p>
        ) : null}
      </div>
    </Link>
  );
}

export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
