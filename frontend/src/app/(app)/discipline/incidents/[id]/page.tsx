import { DisciplineIncidentDetailPage } from "@/modules/discipline/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DisciplineIncidentDetailPage id={id} />;
}
