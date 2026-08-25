import { SurveyResponsesPage } from "@/modules/surveys/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SurveyResponsesPage id={id} />;
}
