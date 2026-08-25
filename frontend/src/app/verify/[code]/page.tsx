import { PublicVerifyPage } from "@/modules/certificates/pages";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PublicVerifyPage code={code} />;
}
