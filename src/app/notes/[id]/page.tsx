import { NoteDetailView } from "@/components/page-sections";

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  return <NoteDetailView id={params.id} />;
}
