import { LibraryBookDetailPage } from "@/modules/library/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LibraryBookDetailPage id={id} />;
}
