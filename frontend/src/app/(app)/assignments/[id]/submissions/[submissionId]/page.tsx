import { AssignmentSubmissionDetailPage } from "@/modules/assignments/pages";

export default async function Page({ params }: { params: Promise<{ id: string; submissionId: string }> }) {
  const { id, submissionId } = await params;
  return <AssignmentSubmissionDetailPage id={id} submissionId={submissionId} />;
}
