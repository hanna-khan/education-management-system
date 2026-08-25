import { VisitorPassDetailPage } from "@/modules/visitors/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VisitorPassDetailPage id={id} />;
}
