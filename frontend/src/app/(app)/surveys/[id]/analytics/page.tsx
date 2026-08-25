import { SurveyAnalyticsPage } from "@/modules/surveys/pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SurveyAnalyticsPage id={id} />;
}
