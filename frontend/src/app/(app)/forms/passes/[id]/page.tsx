import { FormsPassDetailPage } from "@/modules/forms/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FormsPassDetailPage id={id} />;
}
