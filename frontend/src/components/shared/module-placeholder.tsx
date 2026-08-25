import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  module: string;
}

export function ModulePlaceholder({
  title,
  description,
  module,
}: ModulePlaceholderProps) {
  return (
    <div className="animate-fade-in">
      <PageHeader
        breadcrumbs={
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: title },
            ]}
          />
        }
        title={title}
        description={description}
      />
      <EmptyState
        icon={Construction}
        title={`${module} module — coming next`}
        description="The application shell, design system, and navigation are ready. This module will be built in the next implementation phase with realistic mock data and full workflows."
        actionLabel="Return to dashboard"
      />
      <div className="mt-4 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            Go to dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
