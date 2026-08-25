import { MaintenanceTicketDetailPage } from "@/modules/maintenance/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaintenanceTicketDetailPage id={id} />;
}
