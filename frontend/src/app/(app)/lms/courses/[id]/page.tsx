import { LmsCourseDetailPage } from "@/modules/lms/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LmsCourseDetailPage id={id} />;
}
