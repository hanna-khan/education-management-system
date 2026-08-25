import { ItHelpdeskTicketDetailPage } from "@/modules/it-helpdesk/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItHelpdeskTicketDetailPage id={id} />;
}
