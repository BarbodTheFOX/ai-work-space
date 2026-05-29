import { MeetingDetailView } from "@/components/page-sections";

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  return <MeetingDetailView id={params.id} />;
}
