import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentProfileContent } from "@/modules/students/student-profile";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <StudentProfileContent id={id} />
    </Suspense>
  );
}
