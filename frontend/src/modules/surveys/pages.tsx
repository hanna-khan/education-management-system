"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  ClipboardPen,
  FileText,
  MessageSquare,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { ModuleHub, InfoCard, SimpleTable } from "@/components/shared/module-hub";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MockActionButton, MockToastButton, type MockField } from "@/components/shared/mock-action";
import {
  SURVEYS_TABS,
  getSurvey,
  getSurveyAnalytics,
  getSurveyResponses,
  mockSurveys,
  studentSurveySummary,
  surveysStats,
} from "@/mock/surveys";
import type { SurveyQuestion } from "@/types/surveys";
import { formatNumber } from "@/lib/utils";

const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Surveys" }];

function questionToMockField(q: SurveyQuestion): MockField {
  if (q.type === "yes_no") {
    return { name: q.id, label: q.text, type: "select", options: ["Yes", "No"], required: q.required };
  }
  if (q.type === "multiple_choice" || q.type === "checkbox") {
    return {
      name: q.id,
      label: q.text,
      type: "select",
      options: q.options ?? ["Option A", "Option B"],
      required: q.required,
    };
  }
  if (q.type === "text") {
    return { name: q.id, label: q.text, type: "textarea", required: q.required };
  }
  if (q.type === "rating" || q.type === "scale") {
    return {
      name: q.id,
      label: q.text,
      type: "number",
      required: q.required,
      placeholder: q.type === "scale" ? `${q.scaleMin ?? 1}–${q.scaleMax ?? 10}` : "1–5",
    };
  }
  return { name: q.id, label: q.text, type: "text", required: q.required };
}

function statusBadge(status: string) {
  const map: Record<string, "default" | "success" | "warning" | "error" | "info" | "outline"> = {
    draft: "outline",
    published: "success",
    closed: "info",
    archived: "outline",
    student: "info",
    parent: "warning",
    teacher: "default",
    course_evaluation: "success",
    event_feedback: "info",
    staff: "outline",
    rating: "info",
    multiple_choice: "default",
    checkbox: "warning",
    text: "outline",
    yes_no: "success",
    scale: "info",
  };
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function SurveysDashboardPage() {
  return (
    <ModuleHub
      title="Survey Builder"
      description="QEC surveys — student satisfaction, course evaluation, parent feedback, and event feedback at NED University."
      breadcrumbs={breadcrumbs}
      tabs={SURVEYS_TABS}
      actions={
        <Button asChild>
          <Link href="/surveys/create"><Plus className="mr-2 size-4" />Create survey</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total surveys" value={surveysStats.totalSurveys} icon={ClipboardPen} />
        <KpiCard label="Active surveys" value={surveysStats.activeSurveys} icon={FileText} changeType="positive" />
        <KpiCard label="Total responses" value={formatNumber(surveysStats.totalResponses)} icon={Users} />
        <KpiCard label="Avg response rate" value={`${surveysStats.avgResponseRate}%`} icon={BarChart3} />
        <KpiCard label="Avg rating" value={String(surveysStats.avgRating)} icon={Star} changeType="positive" />
        <KpiCard label="Pending reviews" value={surveysStats.pendingReviews} icon={MessageSquare} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active surveys</CardTitle>
            <Button asChild variant="outline" size="sm"><Link href="/surveys/list">View all</Link></Button>
          </CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Survey", "Audience", "Responses", "Rate", "Status"]}
              rows={mockSurveys.filter((s) => s.status === "published").map((s) => [
                <Link key={s.id} href={`/surveys/${s.id}`} className="font-medium hover:underline">{s.title.slice(0, 35)}…</Link>,
                statusBadge(s.audience),
                `${s.responseCount}/${s.targetCount}`,
                s.targetCount > 0 ? `${Math.round((s.responseCount / s.targetCount) * 100)}%` : "—",
                statusBadge(s.status),
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Survey audiences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["student", "parent", "teacher", "course_evaluation", "event_feedback", "staff"] as const).map((aud) => {
              const count = mockSurveys.filter((s) => s.audience === aud).length;
              const pct = Math.round((count / mockSurveys.length) * 100);
              return (
                <div key={aud}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-[var(--muted)]">{aud.replace(/_/g, " ")}</span>
                    <span className="font-medium">{count}</span>
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

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent responses</CardTitle></CardHeader>
        <CardContent>
          <SimpleTable
            columns={["Survey", "Respondent", "Audience", "Responses", "Closes"]}
            rows={mockSurveys.filter((s) => s.responseCount > 0).map((s) => [
              s.surveyId,
              s.createdBy,
              statusBadge(s.audience),
              String(s.responseCount),
              s.closesAt ?? "—",
            ])}
          />
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function SurveysListPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return mockSurveys;
    return mockSurveys.filter((s) => s.status === filter);
  }, [filter]);

  return (
    <ModuleHub title="All Surveys" description="Manage published, draft, and closed surveys." breadcrumbs={[...breadcrumbs, { label: "All Surveys" }]} tabs={SURVEYS_TABS}
      actions={<Button asChild><Link href="/surveys/create"><Plus className="mr-2 size-4" />Create</Link></Button>}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "draft", "published", "closed", "archived"].map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize">
            {s}: {s === "all" ? mockSurveys.length : mockSurveys.filter((x) => x.status === s).length}
          </Button>
        ))}
      </div>
      <SimpleTable
        columns={["Survey ID", "Title", "Audience", "Questions", "Responses", "Created", "Status", ""]}
        rows={filtered.map((s) => [
          s.surveyId,
          s.title.slice(0, 40) + "…",
          statusBadge(s.audience),
          String(s.questions.length),
          `${s.responseCount}/${s.targetCount || "—"}`,
          s.createdAt,
          statusBadge(s.status),
          <Button key={s.id} asChild size="sm" variant="outline"><Link href={`/surveys/${s.id}`}>View</Link></Button>,
        ])}
      />
    </ModuleHub>
  );
}

export function SurveysCreatePage() {
  return (
    <ModuleHub
      title="Create Survey"
      description="Build a new survey with multiple question types."
      breadcrumbs={[...breadcrumbs, { label: "Create" }]}
      tabs={SURVEYS_TABS}
      actions={<MockToastButton label="Save as draft" message="Survey saved as draft (demo)." variant="outline" />}
    >
      <MockActionButton
        className="mb-6"
        label="Create survey"
        title="New survey"
        fields={[
          { name: "title", label: "Survey title", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "audience", label: "Audience", type: "select", options: ["student", "parent", "teacher", "course_evaluation", "event_feedback", "staff"], required: true },
          { name: "closesAt", label: "Closing date", type: "date" },
        ]}
        submitLabel="Create & add questions"
        successMessage="Survey created. Add questions in the builder (demo)."
        icon={<ClipboardPen className="size-4" />}
      />
      <Card>
        <CardHeader><CardTitle>Question types</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Rating", "1–5 star rating scale", "rating"],
            ["Multiple choice", "Single selection from options", "multiple_choice"],
            ["Checkbox", "Multiple selections allowed", "checkbox"],
            ["Text", "Free-form text response", "text"],
            ["Yes/No", "Binary choice", "yes_no"],
            ["Scale", "Numeric scale (e.g. 1–10)", "scale"],
          ].map(([name, desc, type]) => (
            <div key={type} className="rounded-lg border border-[var(--border-subtle)] p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">{name}</p>
                {statusBadge(type)}
              </div>
              <p className="mt-1 text-[var(--muted)]">{desc}</p>
              <MockToastButton className="mt-3" label="Add question" message={`${name} question added (demo).`} size="sm" variant="outline" />
            </div>
          ))}
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function SurveyDetailPage({ id }: { id: string }) {
  const survey = getSurvey(id) ?? mockSurveys[0];

  return (
    <ModuleHub
      title={survey.title}
      description={survey.description}
      breadcrumbs={[...breadcrumbs, { label: "All Surveys", href: "/surveys/list" }, { label: survey.surveyId }]}
      tabs={SURVEYS_TABS}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link href={`/surveys/${survey.id}/analytics`}>Analytics</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href={`/surveys/${survey.id}/responses`}>Responses</Link></Button>
          <MockToastButton label="Publish" message="Survey published (demo)." size="sm" />
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Status" value={survey.status} />
        <InfoCard label="Audience" value={survey.audience.replace(/_/g, " ")} />
        <InfoCard label="Responses" value={`${survey.responseCount} / ${survey.targetCount || "—"}`} />
        <InfoCard label="Created by" value={survey.createdBy} sub={survey.createdAt} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Questions ({survey.questions.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {survey.questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-[var(--border-subtle)] p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">Q{i + 1}. {q.text}</p>
                <div className="flex gap-1">
                  {statusBadge(q.type)}
                  {q.required ? <Badge variant="warning">Required</Badge> : null}
                </div>
              </div>
              {q.options ? <p className="mt-2 text-[var(--muted)]">Options: {q.options.join(", ")}</p> : null}
              {q.scaleMin !== undefined ? <p className="mt-2 text-[var(--muted)]">Scale: {q.scaleMin}–{q.scaleMax}</p> : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-[var(--muted)]">Published: </span>{survey.publishedAt ?? "Not yet published"}</p>
          <p><span className="text-[var(--muted)]">Closes: </span>{survey.closesAt ?? "No closing date"}</p>
        </CardContent>
      </Card>
    </ModuleHub>
  );
}

export function SurveyAnalyticsPage({ id }: { id: string }) {
  const survey = getSurvey(id) ?? mockSurveys[0];
  const analytics = getSurveyAnalytics(id);

  return (
    <ModuleHub
      title="Survey Analytics"
      description={survey.title}
      breadcrumbs={[...breadcrumbs, { label: "All Surveys", href: "/surveys/list" }, { label: survey.surveyId, href: `/surveys/${survey.id}` }, { label: "Analytics" }]}
      tabs={SURVEYS_TABS}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Responses" value={String(analytics.responseCount)} />
        <InfoCard label="Response rate" value={`${analytics.responseRate}%`} />
        <InfoCard label="Average rating" value={analytics.avgRating > 0 ? String(analytics.avgRating) : "—"} />
        <InfoCard label="Target" value={String(survey.targetCount)} />
      </div>

      <div className="mt-6 space-y-6">
        {analytics.questionBreakdown.map((q) => (
          <Card key={q.questionId}>
            <CardHeader><CardTitle className="text-base">{q.questionText}</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {q.avgRating !== undefined ? (
                <p className="font-medium">Average rating: {q.avgRating} / 5</p>
              ) : null}
              {q.distribution ? (
                <div className="mt-3 space-y-2">
                  {Object.entries(q.distribution).map(([key, count]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-16 capitalize text-[var(--muted)]">{key}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${Math.min(100, (count / analytics.responseCount) * 100)}%` }} />
                      </div>
                      <span className="w-8 text-right font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {q.sampleComments ? (
                <div className="mt-4 space-y-2">
                  <p className="text-[var(--muted)]">Sample comments:</p>
                  {q.sampleComments.map((c, i) => (
                    <p key={i} className="rounded-lg border border-[var(--border-subtle)] p-2 italic">&ldquo;{c}&rdquo;</p>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleHub>
  );
}

export function SurveyResponsesPage({ id }: { id: string }) {
  const survey = getSurvey(id) ?? mockSurveys[0];
  const responses = getSurveyResponses(id);

  return (
    <ModuleHub
      title="Survey Responses"
      description={survey.title}
      breadcrumbs={[...breadcrumbs, { label: "All Surveys", href: "/surveys/list" }, { label: survey.surveyId, href: `/surveys/${survey.id}` }, { label: "Responses" }]}
      tabs={SURVEYS_TABS}
      actions={<MockToastButton label="Export CSV" message="Responses exported to CSV (demo)." variant="outline" />}
    >
      {responses.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No responses yet" description="Responses will appear here once participants submit the survey." />
      ) : (
        <>
          <SimpleTable
            columns={["Respondent", "ID", "Submitted", "Comment"]}
            rows={responses.map((r) => [r.respondentName, r.respondentId, r.submittedAt, r.comment?.slice(0, 40) ?? "—"])}
          />
          <div className="mt-6 space-y-4">
            {responses.map((r) => (
              <Card key={r.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{r.respondentName}</CardTitle>
                  <span className="text-xs text-[var(--muted)]">{r.submittedAt}</span>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {Object.entries(r.answers).map(([qId, ans]) => {
                    const q = survey.questions.find((x) => x.id === qId);
                    return (
                      <div key={qId} className="flex justify-between gap-4 border-b border-[var(--border-subtle)] py-2">
                        <span className="text-[var(--muted)]">{q?.text ?? qId}</span>
                        <span className="font-medium text-right">{Array.isArray(ans) ? ans.join(", ") : String(ans)}</span>
                      </div>
                    );
                  })}
                  {r.comment ? <p className="pt-2 italic text-[var(--muted)]">&ldquo;{r.comment}&rdquo;</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </ModuleHub>
  );
}

export function StudentSurveysPage() {
  const summary = studentSurveySummary;

  return (
    <ModuleHub
      title="Surveys"
      description="Complete pending surveys — course evaluation, satisfaction, and feedback."
      breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Surveys" }]}
    >
      {summary.pending.length > 0 ? (
        <div className="space-y-4">
          {summary.pending.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{s.description.slice(0, 120)}…</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">{s.questions.length} questions · Closes {s.closesAt ?? "—"}</p>
                </div>
                <MockActionButton
                  label="Take survey"
                  title={s.title}
                  fields={s.questions.slice(0, 3).map(questionToMockField)}
                  submitLabel="Submit responses"
                  successMessage="Survey responses submitted. Thank you for your feedback!"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={ClipboardPen} title="No pending surveys" description="You're all caught up! Check back later for new surveys." />
      )}

      {summary.completed.length > 0 ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>Completed surveys</CardTitle></CardHeader>
          <CardContent>
            <SimpleTable
              columns={["Survey ID", "Status"]}
              rows={summary.completed.map((id) => [id, <Badge key={id} variant="success">Completed</Badge>])}
            />
          </CardContent>
        </Card>
      ) : null}
    </ModuleHub>
  );
}
