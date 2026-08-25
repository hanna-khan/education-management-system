import { TeacherProfileContent } from "@/modules/teachers/teacher-profile";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeacherProfileContent id={id} />;
}
