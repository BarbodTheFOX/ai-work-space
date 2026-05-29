import { ProjectDetailView } from "@/components/page-sections";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ProjectDetailView id={params.id} />;
}
